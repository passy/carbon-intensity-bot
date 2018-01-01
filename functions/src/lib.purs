module Lib (requestCo2LatLon, Co2Response, ApiToken) where

import Prelude

import Control.Monad.Aff (Aff, throwError, error)
import Control.Monad.Eff (Eff)
import Control.Promise as Promise
import Data.Argonaut.Decode (class DecodeJson, decodeJson, (.?))
import Data.Either (Either(Right, Left))
import Data.Function.Uncurried (Fn3, mkFn3)
import Network.HTTP.Affjax (get, URL, Affjax, AJAX)
import Network.HTTP.Affjax.Response (class Respondable)

newtype ApiToken = ApiToken URL

baseUrl :: String
baseUrl = "https://api.co2signal.com/v1/"

data Co2Response = Co2Response
    { countryCode :: String
    , carbonIntensity :: Number
    , fossilFuelPercentage :: Number
    , datetime :: String -- FIXME
    }

instance decodeJsonCo2Response :: DecodeJson Co2Response where
  decodeJson json = do
    obj <- decodeJson json
    countryCode <- obj .? "countryCode"
    data' <- obj .? "data"
    carbonIntensity <- data' .? "carbonIntensity"
    datetime <- data' .? "datetime"
    fossilFuelPercentage <- data' .? "fossilFuelPercentage"
    pure $ Co2Response { countryCode, carbonIntensity, datetime, fossilFuelPercentage }

-- TODO: Tag lat/lon
requestCo2LatLonAff :: forall e a. Respondable a => ApiToken -> Number -> Number -> Affjax e a
requestCo2LatLonAff (ApiToken token) lat lon =
    get $ baseUrl <> "latest?lat=" <> show lat <> "&lon=" <> show lon <>
                                    "&api-token" <> token

getCo2LatLonAff :: forall eff. ApiToken -> Number -> Number -> Aff (ajax :: AJAX | eff) (Either String Co2Response)
getCo2LatLonAff token lat lon = do
  { response } <- requestCo2LatLonAff token lat lon
  pure $ decodeJson response

requestCo2LatLon_ :: forall eff. ApiToken -> Number -> Number -> Eff (ajax :: AJAX | eff) (Promise.Promise Co2Response)
requestCo2LatLon_ token lat lon = Promise.fromAff $ do
    getCo2LatLonAff token lat lon >>= case _ of
        Left e -> throwError $ error e
        Right res -> pure res

requestCo2LatLon :: forall eff. Fn3 ApiToken Number Number (Eff (ajax :: AJAX | eff) (Promise.Promise Co2Response))
requestCo2LatLon = mkFn3 requestCo2LatLon_