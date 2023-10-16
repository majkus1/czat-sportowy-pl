// import { useState } from 'react'
// import ChatComponent from '../../components/ChatComponent'

// export default function NHL() {
// 	const [showChat, setShowChat] = useState(false)

// 	return (
// 		<div>
// 			<h1>Mecze w NHL</h1>
// 			<div onClick={() => setShowChat(!showChat)}>GKS Katowice - Zagłębie Sosnowiec</div>
// 			{showChat && <ChatComponent />}
// 		</div>
// 	)
// }

// pages/nhl.js

import { useState, useEffect } from 'react'
import ChatComponent from '../../components/ChatComponent'
import NavBar from '@/components/NavBar'
import { GiPlayButton } from 'react-icons/gi'

export default function NHL() {
	const [showChat2, setShowChat2] = useState(false)
	const [token, setToken] = useState(null)

	useEffect(() => {
		setToken(sessionStorage.getItem('token'))
	}, [])

	return (
		<div>
			<NavBar />
			<div className='content-league'>
				<h1>
					<img src='/img/ice-hockey.png' className='icon-sport' />
					NHL
				</h1>
				<div className='chat-content'>
					<div onClick={() => setShowChat2(!showChat2)} className='match-name'>
					<GiPlayButton style={{ marginRight: '10px' }} /><p>Columbus - Detroit <br></br> <span>17.10, 01:00</span></p>
					</div>
					{showChat2 && (
						<div className='chat-public'>
							<ChatComponent token={token} username={sessionStorage.getItem('username')} chatId='NHL' />
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
