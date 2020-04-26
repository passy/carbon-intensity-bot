module GenerateTypes where

import Prelude
import Effect.Aff (launchAff_)
import Effect (Effect)
import Data.Array (intercalate)
import Node.Encoding (Encoding(..))
import Node.FS.Aff (writeTextFile)
import OhYes (generateTS)
import Text.Prettier (defaultOptions, format)
import Type.Prelude (Proxy(..))
import Shared (SharedResponse)

main :: Effect Unit
main =
  launchAff_ do
    writeTextFile UTF8 "./src/generated.ts" values
  where
  values =
    format defaultOptions
      $ intercalate "\n"
          [ generateTS "SharedResponse" (Proxy :: Proxy SharedResponse)
          ]
