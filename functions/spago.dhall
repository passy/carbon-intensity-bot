{-
Welcome to a Spago project!
You can edit this file as you like.
-}
{ name = "functions"
, dependencies =
  [ "aff-promise"
  , "argonaut-codecs"
  , "argonaut-core"
  , "console"
  , "debug"
  , "effect"
  , "foreign"
  , "functions"
  , "node-fs-aff"
  , "prelude"
  , "prettier"
  , "psci-support"
  , "foreign-generic"
  , "variant"
  , "affjax"
  , "ohyes"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
