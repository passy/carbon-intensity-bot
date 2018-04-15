module Shared (SharedResponse(..)) where

import OhYes (class HasTSRep)
  
newtype SharedResponse = SharedResponse
    { countryCode :: String
    , carbonIntensityUnit :: String
    , carbonIntensity :: Number
    , fossilFuelPercentage :: Number
    }

derive newtype instance hasTSRepTestType :: HasTSRep SharedResponse