module Lib  where

import Prelude
import Network.HTTP.Affjax (get, URL, Affjax)
import Network.HTTP.Affjax.Response (class Respondable)

newtype ApiToken = ApiToken URL

baseUrl :: String
baseUrl = "https://api.co2signal.com/v1/"

purescript :: String
purescript = "Pure" <> "script"

requestCo2LatLon :: forall e a. Respondable a => ApiToken -> Number -> Number -> Affjax e a
requestCo2LatLon (ApiToken token) lat lon = do
    get $ baseUrl <> "latest?lat=" <> show lat <> "&lon=" <> show lon <>
                                    "&api-token" <> token
