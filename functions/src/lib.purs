module Lib (purescript) where

import Prelude

import Control.Monad.Aff (Aff, throwError, error)
import Control.Monad.Eff (Eff)
import Control.Promise as Promise
import Data.Argonaut.Decode ((.?), class DecodeJson, decodeJson)
import Data.Either (Either(Right, Left), either)
import Network.HTTP.Affjax (get, URL, Affjax, AJAX)
import Network.HTTP.Affjax.Response (class Respondable)

newtype ApiToken = ApiToken URL

baseUrl :: String
baseUrl = "https://api.co2signal.com/v1/"

purescript :: String
purescript = "Pure" <> "script"

data Co2Response = Co2Response Number

instance decodeJsonCo2Response :: DecodeJson Co2Response where
  decodeJson json =
    pure $ Co2Response 5.0

-- TODO: Tag lat/lon
requestCo2LatLonAff :: forall e a. Respondable a => ApiToken -> Number -> Number -> Affjax e a
requestCo2LatLonAff (ApiToken token) lat lon =
    get $ baseUrl <> "latest?lat=" <> show lat <> "&lon=" <> show lon <>
                                    "&api-token" <> token

getCo2LatLonAff :: forall eff. ApiToken -> Number -> Number -> Aff (ajax :: AJAX | eff) (Either String Co2Response)
getCo2LatLonAff token lat lon = do
  { response } <- requestCo2LatLonAff token lat lon
  pure $ decodeJson response

requestCo2LatLon :: forall eff. ApiToken -> Number -> Number -> Eff (ajax :: AJAX | eff) (Promise.Promise Number)
requestCo2LatLon token lat lon = Promise.fromAff $ do
    getCo2LatLonAff token lat lon >>= case _ of
        Left e -> throwError $ error e
        Right (Co2Response n) -> pure n