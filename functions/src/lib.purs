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
    ) where

import Prelude

import Control.Monad.Aff (Aff, throwError, error)
import Control.Monad.Eff (Eff)
import Control.Promise as Promise
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, decodeJson, (.?), (.??))
import Data.Either (Either(Left, Right))
import Data.Function.Uncurried (Fn2, mkFn2)
import Data.Maybe (Maybe(Just, Nothing))
import Debug.Trace (spy)
import Network.HTTP.Affjax (get, URL, Affjax, AJAX)
import Network.HTTP.Affjax.Response (class Respondable)
import Network.HTTP.StatusCode (StatusCode(..))

newtype ApiToken = ApiToken URL
newtype CountryCode = CountryCode String

newtype LatLon = LatLon { lat :: Number, lon :: Number }

baseUrl :: String
baseUrl = "https://api.co2signal.com/v1/"

data Co2ResponseF a = Co2Response
    { countryCode :: String
    , carbonIntensityUnit :: String
    , carbonData :: a
    }

data Co2ResponseData = Co2ResponseData
    { carbonIntensity :: Number
    , fossilFuelPercentage :: Number
    }

type Co2Response = Co2ResponseF Co2ResponseData
type PartialCo2Response = Co2ResponseF (Maybe Co2ResponseData)

instance decodeJsonCo2Response :: DecodeJson (Co2ResponseF (Maybe Co2ResponseData)) where
  decodeJson json = do
    obj <- decodeJson json
    countryCode <- obj .? "countryCode"
    units <- obj .? "units"
    carbonIntensityUnit <- units .? "carbonIntensity"

    data' <- obj .? "data"
    carbonIntensity :: Maybe Number <- data' .?? "carbonIntensity"
    maybeFossilFuelPercentage :: Maybe (Maybe Number) <- data' .?? "fossilFuelPercentage"

    let fossilFuelPercentage :: Maybe Number 
        fossilFuelPercentage = join maybeFossilFuelPercentage
    let carbonData' = { carbonIntensity: _, fossilFuelPercentage: _ } <$> carbonIntensity <*> fossilFuelPercentage
    let carbonData = Co2ResponseData <$> carbonData'

    pure $ Co2Response { countryCode, carbonIntensityUnit, carbonData }

decodeCo2Response :: Json -> Either String Co2Response
decodeCo2Response json = do
    (Co2Response obj) :: PartialCo2Response <- decodeJson json
    case obj.carbonData of
        Just d -> Right $ Co2Response $ { countryCode: obj.countryCode, carbonIntensityUnit: obj.carbonIntensityUnit, carbonData: d }
        Nothing -> Left "Incomplete response"

requestCo2LatLonAff :: forall e a. Respondable a => LatLon -> ApiToken -> Affjax e a
requestCo2LatLonAff (LatLon l) (ApiToken token) =
    get $ baseUrl <> "latest?lat=" <> show l.lat <> "&lon=" <> show l.lon <>
                                    "&auth-token=" <> token

requestCo2CountryAff :: forall e a. Respondable a => CountryCode -> ApiToken -> Affjax e a
requestCo2CountryAff (CountryCode code) (ApiToken token) =
    get $ baseUrl <> "latest?countryCode=" <> code <> "&auth-token=" <> token

getCo2Aff
    :: forall eff
    .  Affjax eff Json
    -> Aff (ajax :: AJAX | eff) (Either String Co2Response)
getCo2Aff req = do
  { status, response } <- req
  when (status /= StatusCode 200) $
    throwError $ error $ "Response code " <> show status <> " /= 200: " <> show response
  pure $ decodeCo2Response $ spy response

requestCo2
    :: forall eff
    .  (ApiToken -> Affjax eff Json)
    -> ApiToken
    -> Eff (ajax :: AJAX | eff) (Promise.Promise Co2Response)
requestCo2 fn token = Promise.fromAff $ do
    getCo2Aff (fn token) >>= case _ of
        Left e -> throwError $ error e
        Right res -> pure res

requestCo2LatLon_ :: forall eff. ApiToken -> LatLon -> (Eff (ajax :: AJAX | eff) (Promise.Promise Co2Response))
requestCo2LatLon_ token l =
    requestCo2 (requestCo2LatLonAff l) token

requestCo2LatLon :: forall eff. Fn2 ApiToken LatLon (Eff (ajax :: AJAX | eff) (Promise.Promise Co2Response))
requestCo2LatLon = mkFn2 requestCo2LatLon_

requestCo2Country_ :: forall eff. ApiToken -> CountryCode -> (Eff (ajax :: AJAX | eff) (Promise.Promise Co2Response))
requestCo2Country_ token countryCode =
    requestCo2 (requestCo2CountryAff countryCode) token

requestCo2Country :: forall eff. Fn2 ApiToken CountryCode (Eff (ajax :: AJAX | eff) (Promise.Promise Co2Response))
requestCo2Country = mkFn2 requestCo2Country_
