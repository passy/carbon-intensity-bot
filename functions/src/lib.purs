module Lib
  ( requestCo2LatLon
  , requestCo2Country
  , decodeCo2Response
  , Co2ResponseF
  , Co2Response
  , Co2ResponseData
  , ApiToken
  , CountryCode
  , LatLon
  , ResponseError(..)
  ) where

import Prelude
import Affjax (Response, ResponseFormatError, URL, get, printResponseFormatError)
import Affjax.ResponseFormat as ResponseFormat
import Affjax.StatusCode (StatusCode(..))
import Control.Comonad (extract)
import Control.Promise as Promise
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, decodeJson, (.:), (.:?))
import Data.Bifunctor (lmap)
import Data.Either (Either(Left, Right))
import Data.Function.Uncurried (Fn2, mkFn2)
import Data.Generic.Rep (class Generic)
import Data.Identity (Identity(..))
import Data.Maybe (Maybe(Just, Nothing))
import Effect (Effect)
import Effect.Aff (Aff, throwError, error)
import Foreign.Generic (defaultOptions, genericEncodeJSON)
import Shared (SharedResponse(SharedResponse))

newtype ApiToken
  = ApiToken URL

newtype CountryCode
  = CountryCode String

newtype LatLon
  = LatLon { lat :: Number, lon :: Number }

baseUrl :: String
baseUrl = "https://api.co2signal.com/v1/"

data Co2ResponseF f
  = Co2Response
    { countryCode :: String
    , carbonIntensityUnit :: String
    , carbonData :: f Co2ResponseData
    }

data Co2ResponseData
  = Co2ResponseData
    { carbonIntensity :: Number
    , fossilFuelPercentage :: Number
    }

data ResponseError
  = ErrDecode String
  | ErrStatusCode Int String
  | ErrIncompleteResponse

derive instance genericResponseError :: Generic ResponseError _

type Co2Response
  = Co2ResponseF Identity

type PartialCo2Response
  = Co2ResponseF Maybe

responseToShared :: Co2Response -> SharedResponse
responseToShared (Co2Response r) =
  let
    (Co2ResponseData d) = extract r.carbonData
  in
    SharedResponse
      { countryCode: r.countryCode
      , carbonIntensityUnit: r.carbonIntensityUnit
      , carbonIntensity: d.carbonIntensity
      , fossilFuelPercentage: d.fossilFuelPercentage
      }

instance decodeJsonCo2Response :: DecodeJson (Co2ResponseF Maybe) where
  decodeJson json = do
    obj <- decodeJson json
    countryCode <- obj .: "countryCode"
    units <- obj .: "units"
    carbonIntensityUnit <- units .: "carbonIntensity"
    data' <- obj .: "data"
    carbonIntensity :: Maybe Number <- data' .:? "carbonIntensity"
    maybeFossilFuelPercentage :: Maybe (Maybe Number) <- data' .:? "fossilFuelPercentage"
    let
      fossilFuelPercentage :: Maybe Number
      fossilFuelPercentage = join maybeFossilFuelPercentage
    let
      carbonData' = { carbonIntensity: _, fossilFuelPercentage: _ } <$> carbonIntensity <*> fossilFuelPercentage
    let
      carbonData = Co2ResponseData <$> carbonData'
    pure $ Co2Response { countryCode, carbonIntensityUnit, carbonData }

decodeCo2Response :: Json -> Either ResponseError Co2Response
decodeCo2Response json = do
  (Co2Response obj) :: PartialCo2Response <- decodeJson json # lmap ErrDecode
  case obj.carbonData of
    Just d -> Right $ Co2Response $ { countryCode: obj.countryCode, carbonIntensityUnit: obj.carbonIntensityUnit, carbonData: Identity d }
    Nothing -> Left ErrIncompleteResponse

type Affjax a
  = Aff (Response (Either ResponseFormatError a))

requestCo2LatLonAff :: LatLon -> ApiToken -> Affjax Json
requestCo2LatLonAff (LatLon l) (ApiToken token) =
  get ResponseFormat.json $ baseUrl <> "latest?lat=" <> show l.lat <> "&lon=" <> show l.lon
    <> "&auth-token="
    <> token

requestCo2CountryAff :: CountryCode -> ApiToken -> Affjax Json
requestCo2CountryAff (CountryCode code) (ApiToken token) = get ResponseFormat.json $ baseUrl <> "latest?countryCode=" <> code <> "&auth-token=" <> token

getCo2Aff ::
  Affjax Json ->
  Aff (Either ResponseError Co2Response)
getCo2Aff req = do
  { status, statusText, body } <- req
  pure
    $ case body of
        Left error -> Left $ ErrStatusCode 500 (printResponseFormatError error)
        Right response -> case status of
          StatusCode 200 -> decodeCo2Response response
          StatusCode n -> Left $ ErrStatusCode n statusText

requestCo2 ::
  (ApiToken -> Affjax Json) ->
  ApiToken ->
  Effect (Promise.Promise SharedResponse)
requestCo2 fn token =
  Promise.fromAff
    $ do
        getCo2Aff (fn token)
          >>= case _ of
              Left e -> throwError $ error $ genericEncodeJSON defaultOptions e
              Right res -> pure $ responseToShared res

requestCo2LatLon_ :: ApiToken -> LatLon -> (Effect (Promise.Promise SharedResponse))
requestCo2LatLon_ token l = requestCo2 (requestCo2LatLonAff l) token

requestCo2LatLon :: Fn2 ApiToken LatLon (Effect (Promise.Promise SharedResponse))
requestCo2LatLon = mkFn2 requestCo2LatLon_

requestCo2Country_ :: ApiToken -> CountryCode -> (Effect (Promise.Promise SharedResponse))
requestCo2Country_ token countryCode = requestCo2 (requestCo2CountryAff countryCode) token

requestCo2Country :: Fn2 ApiToken CountryCode (Effect (Promise.Promise SharedResponse))
requestCo2Country = mkFn2 requestCo2Country_
