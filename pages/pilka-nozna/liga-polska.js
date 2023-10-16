// import { useState } from 'react';
// import ChatComponent from '../../components/ChatComponent';

// export default function LigaPolska() {
//     const [showChat, setShowChat] = useState(false);

//     return (
//         <div>
//             <h1>Mecze w Lidze Polskiej</h1>
//             <div onClick={() => setShowChat(!showChat)}>
//                 Legia Warszawa - Wisła Kraków
//             </div>
//             {showChat && <ChatComponent />}
//         </div>
//     );
// }

import { useState, useEffect, useContext } from 'react'
import ChatComponent from '../../components/ChatComponent'
import NavBar from '@/components/NavBar'
import { UserContext } from '@/components/UserContext'
import { GiPlayButton } from 'react-icons/gi'

export default function Plfootball() {
	const [showChat, setShowChat] = useState(false)
	const [showChat2, setShowChat2] = useState(false)
	const { token } = useContext(UserContext)

	return (
		<>
			<NavBar />
			<div className='content-league'>
				<h1><img src='/img/football.png' className='icon-sport' />PKO BP Ekstraklasa</h1>
				<div className='chat-content'>
					<div onClick={() => setShowChat2(!showChat2)} className='match-name'>
						<GiPlayButton style={{ marginRight: '10px' }} /><p>Piast Gliwice - Pogoń Szczecin <br></br> <span>20.10, 18:00</span></p>
					</div>
					{showChat2 && (
						<div className='chat-public'>
							<ChatComponent token={token} username={sessionStorage.getItem('username')} chatId='LigaPolska2' />
						</div>
					)}
				</div>
				<div className='chat-content'>
					<div onClick={() => setShowChat(!showChat)} className='match-name'>
					<GiPlayButton style={{ marginRight: '10px' }} /><p>Śląsk Wrocław - Legia Warszawa <br></br> <span>21.10, 17:30</span></p>
					</div>
					{showChat && (
						<div className='chat-public'>
							<ChatComponent token={token} username={sessionStorage.getItem('username')} chatId='LigaPolska' />
						</div>
					)}
				</div>
			</div>
		</>
	)
}
