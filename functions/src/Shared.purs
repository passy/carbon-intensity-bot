module Shared (SharedResponse(..)) where

import OhYes (class HasTSRep)
import HasJSRep (class HasJSRep)
  
newtype SharedResponse = SharedResponse
    { countryCode :: String
    , carbonIntensityUnit :: String
    , carbonIntensity :: Number
    , fossilFuelPercentage :: Number
    }

derive newtype instance hasJSRepTestType :: HasJSRep SharedResponse
derive newtype instance hasTSRepTestType :: HasTSRep SharedResponse