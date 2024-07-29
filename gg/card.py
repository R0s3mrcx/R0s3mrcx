import pynecone as pc
from datetime import datetime
import random

# Modules
class State(pc.State):
    number_input: str
    name_input: str
   
    # Function to get numbr input
    def get_number_input(self, number_input):
        self.number_input = number_input

   # Function to get name input
    def get_name_input(self, name_input):
        self.name_input = name_input

# Inputs card

def card_input(card_tittle, input_value, function):
    return pc.container(
        pc.vstack(),
        pc.text(
            card_tittle,
        ),
        pc.input(
            value=input_value,
            width="100%",
            heigh="50px",
            border_radius="5px",
            bg="None",
            border="1px solid #ced6e0",
            font_size="18px",
            padding="5px 15px",
            color="#1a3b5d",
            focus_border_color="None",
            on_change=function,
            _hover={"border-color":"#3d9cff"},
            _focus={
                "border-color":"#3d9cff",
                "box-shadow": "0px 10px 20px -13px rgb(32, 56, 117, 0.35)",
            }
            
        ),   
    )



def card():
    return pc.container(

        # Main UI stack
     pc.vstack(
        # Credit card UI display
        card_input("Card Number", 
                   State.number_input, 
                   lambda: State.get_number_input(),
                   
         ),
         pc.spacer(),
          card_input("Card Holder", 
                   State.name_input, 
                   lambda: State.get_name_input(),
                   
         ),

    ),


        # Form settings
        bg ="#fff",
        padding = "35px",
        padding_top="150px",
        padding_botton="35px",
        max_width="570px",
        width="100%",
        margin="auto",
        border_radius="10px",
        box_shadow="0 30px 60px 0 rgb(90, 116, 148, 0.4)",

)




# Main page UI
def index () -> pc.Component:
    return pc.center(
        # Main card components
        card(),


        # Page settings
        bg="#ddeefc",
        min_heigh="100vh",
        display="flex",
        flex_wrap="wrap",
        flex_direction="column",
        align_items="flex-start",
        padding="50px, 15px",

    )

app = pc.App(state=State)
app.add_page(index)
app.compile()

