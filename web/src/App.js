import TextField from "@material-ui/core/TextField"
import React, { useEffect, useRef, useState } from "react"

import io from "socket.io-client"
// import axios from "axios"
import "./App.css"

function App() {
	

	// const getNews =()=>{
	// 	axios.get("https://newsapi.org/v2/everything?q=tesla&from=2021-12-30&sortBy=publishedAt&apiKey=4cc54e13f6824f358d02af1c4f6583f6")
	// 	.then((response)=>{
	// 		console.log(response);
	// 	})

	const [ state, setState ] = useState({ message: "", name: "" })
	const [ chat ] = useState([])

	const socketRef = useRef()

	useEffect(
		() => {
			socketRef.current = io.connect("http://mst-full-stack-dev-test.herokuapp.com/", {transports: ['websocket']})
			socketRef.current.on("data-update", (msg) => {
				// setChat([ ...chat, { name, message } ])
				console.log(msg)
			})
			return () => socketRef.current.disconnect()
		},
		[ chat ]
			)

	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}

	const onMessageSubmit = (e) => {
		const { name, message } = state
		socketRef.current.emit("message", { name, message })
		e.preventDefault()
		setState({ message: "", name })
	}

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		))
	}



	return (
		
		<div className="card">
			<form onSubmit={onMessageSubmit}>
				<h1>Messenger</h1>
				<div className="name-field">
					<TextField name="name" onChange={(e) => onTextChange(e)} value={state.name} label="Name" />
				</div>
				<div>
					<TextField
						name="message"
						onChange={(e) => onTextChange(e)}
						value={state.message}
						id="outlined-multiline-static"
						variant="outlined"
						label="Message"
					/>
				</div>
				<button>Send Message</button>
			</form>
			<div className="render-chat">
				<h1>Chat Log</h1>
				{renderChat()}
			</div>
		</div>
		
	)
}
export default App

