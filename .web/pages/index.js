import { Fragment, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { connect, E, getRefValue, isTrue, preventDefault, processEvent, refs, set_val, uploadFiles } from "/utils/state"
import "focus-visible/dist/focus-visible"
import { Box, Center, Container, Input, Text, useColorMode, VStack } from "@chakra-ui/react"
import NextHead from "next/head"


export default function Component() {
  const [state, setState] = useState({"is_hydrated": false, "name_input": "", "number_input": "", "events": [{"name": "state.hydrate"}], "files": []})
  const [result, setResult] = useState({"state": null, "events": [], "final": true, "processing": false})
  const [notConnected, setNotConnected] = useState(false)
  const router = useRouter()
  const socket = useRef(null)
  const { isReady } = router
  const { colorMode, toggleColorMode } = useColorMode()
  const focusRef = useRef();
  
  // Function to add new events to the event queue.
  const Event = (events, _e) => {
      preventDefault(_e);
      setState(state => ({
        ...state,
        events: [...state.events, ...events],
      }))
  }

  // Function to add new files to be uploaded.
  const File = files => setState(state => ({
    ...state,
    files,
  }))

  // Main event loop.
  useEffect(()=> {
    // Skip if the router is not ready.
    if (!isReady) {
      return;
    }

    // Initialize the websocket connection.
    if (!socket.current) {
      connect(socket, state, setState, result, setResult, router, ['websocket', 'polling'], setNotConnected)
    }

    // If we are not processing an event, process the next event.
    if (!result.processing) {
      processEvent(state, setState, result, setResult, router, socket.current)
    }

    // If there is a new result, update the state.
    if (result.state != null) {
      // Apply the new result to the state and the new events to the queue.
      setState(state => ({
        ...result.state,
        events: [...state.events, ...result.events],
      }))

      // Reset the result.
      setResult(result => ({
        state: null,
        events: [],
        final: true,
        processing: !result.final,
      }))

      // Process the next event.
      processEvent(state, setState, result, setResult, router, socket.current)
    }
  })

  // Set focus to the specified element.
  useEffect(() => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  })

  // Route after the initial page hydration.
  useEffect(() => {
    const change_complete = () => Event([E('state.hydrate', {})])
    router.events.on('routeChangeComplete', change_complete)
    return () => {
      router.events.off('routeChangeComplete', change_complete)
    }
  }, [router])


  return (
  <Fragment><Fragment>
  <Center sx={{"bg": "#ddeefc", "minHeigh": "100vh", "display": "flex", "flexWrap": "wrap", "flexDirection": "column", "alignItems": "flex-start", "padding": "50px, 15px"}}>
  <Container sx={{"bg": "#fff", "padding": "35px", "paddingTop": "150px", "paddingBotton": "35px", "maxWidth": "570px", "width": "100%", "margin": "auto", "borderRadius": "10px", "boxShadow": "0 30px 60px 0 rgb(90, 116, 148, 0.4)"}}>
  <VStack>
  <Container>
  <VStack/>
  <Text>
  {`Card Number`}
</Text>
  <Input focusBorderColor="None" onChange={_e => Event([E("state.get_number_input", {})], _e)} sx={{"width": "100%", "heigh": "50px", "borderRadius": "5px", "bg": "None", "border": "1px solid #ced6e0", "fontSize": "18px", "padding": "5px 15px", "color": "#1a3b5d"}} type="text" value={state.number_input}/>
</Container>
</VStack>
</Container>
</Center>
  <NextHead>
  <title>
  {`Pynecone App`}
</title>
  <meta content="A Pynecone app." name="description"/>
  <meta content="favicon.ico" property="og:image"/>
</NextHead>
</Fragment>
    </Fragment>
  )
}
