module GameEnd exposing (..)

import Browser
import Html exposing (Html)
import Browser.Dom
import Html exposing (text)

main : Model -> Program () Model Msg
main score =
    Browser.sandbox
        { init = score
        , view = view
        , update = update
        }

type alias Model = Int

type Msg = Update Model | Store

update : Msg -> Model -> Model
update msg model =
    case msg of
        Update value ->
            model + value

        Store ->
            
            model

view : Model -> Html Msg
view model =
    Html.a [] [text "hi"]