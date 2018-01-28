module Lib
    ( requestCo2LatLon
    , requestCo2Country
    , Co2Response
    , ApiToken
    , CountryCode
    , LatLon ) where

import Prelude

import Control.Monad.Aff (Aff, throwError, error)
import Control.Monad.Eff (Eff)
import Control.Promise as Promise
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (class DecodeJson, decodeJson, (.?))
import Data.Either (Either(Right, Left))
import Data.Function.Uncurried (Fn2, mkFn2)
import Network.HTTP.Affjax (get, URL, Affjax, AJAX)
import Network.HTTP.Affjax.Response (class Respondable)
import Network.HTTP.StatusCode (StatusCode(..))

newtype ApiToken = ApiToken URL
newtype CountryCode = CountryCode String

newtype LatLon = LatLon { lat :: Number, lon :: Number }

baseUrl :: String
baseUrl = "https://api.co2signal.com/v1/"

data Co2Response = Co2Response
    { countryCode :: String
    , carbonIntensity :: Number
    , fossilFuelPercentage :: Number
    , carbonIntensityUnit :: String
    }

instance decodeJsonCo2Response :: DecodeJson Co2Response where
  decodeJson json = do
    obj <- decodeJson json
    countryCode <- obj .? "countryCode"
    data' <- obj .? "data"
    carbonIntensity <- data' .? "carbonIntensity"
    fossilFuelPercentage <- data' .? "fossilFuelPercentage"
    units <- obj .? "units"
    carbonIntensityUnit <- units .? "carbonIntensity"
    pure $ Co2Response { countryCode, carbonIntensity, fossilFuelPercentage, carbonIntensityUnit }

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
  pure $ decodeJson response

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
