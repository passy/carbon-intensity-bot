module Types where

import OhYes (class HasTSRep)
  
newtype TestType = TestType { a :: Number }

derive newtype instance hasTSRepTestType :: HasTSRep TestType