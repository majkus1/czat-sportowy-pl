// import { useState, useEffect, useContext } from 'react';
// import { UserContext } from './UserContext';
// import connectToDb from '@/lib/db';
// import Message from '../models/Message';
// import io from 'socket.io-client';

// const ChatComponent = () => {
//     const [messages, setMessages] = useState([]);
//     const [currentMessage, setCurrentMessage] = useState('');
//     const { token } = useContext(UserContext);
//     const socket = io('http://localhost:3000');

//     const handleSendMessage = () => {
//         if (currentMessage.trim()) {
//             // Pobierz nazwę użytkownika z sessionStorage
//             const username = sessionStorage.getItem('username') || 'Anonim';

//             // Dodanie nazwy użytkownika do wiadomości
//             const userMessage = `${username}: ${currentMessage}`;
//             setMessages([...messages, userMessage]);
//             setCurrentMessage('');
//         }
//     };

//     // useEffect(() => {
//     //     socket.on('receive_message', (message) => {
//     //         setMessages((prevMessages) => [...prevMessages, message]);
//     //     });
//     // }, []);

//     // const handleSendMessage = async () => {
//     //     if (currentMessage.trim()) {
//     //         const username = sessionStorage.getItem('username') || 'Anonim';
//     //         const userMessage = `${username}: ${currentMessage}`;

//     //         // Połączenie z bazą danych
//     //         await connectToDb();

//     //         // Zapisywanie wiadomości w bazie danych
//     //         const newMessage = new Message({
//     //             username: username,
//     //             content: currentMessage
//     //         });
//     //         await newMessage.save();

//     //         // Emitowanie wiadomości do serwera za pomocą Socket.io
//     //         socket.emit('send_message', userMessage);

//     //         setMessages([...messages, userMessage]);
//     //         setCurrentMessage('');
//     //     }
//     // };

//     return (
//         <div>
//             <div>
//                 {messages.map((msg, idx) => <div key={idx}>{msg}</div>)}
//             </div>
//             {token ? (
//                 <div>
//                     <input
//                         value={currentMessage}
//                         onChange={(e) => setCurrentMessage(e.target.value)}
//                         type="text"
//                         placeholder="Napisz wiadomość..."
//                     />
//                     <button onClick={handleSendMessage}>Wyślij</button>
//                 </div>
//             ) : (
//                 <p>Musisz się zalogować, aby napisać wiadomość.</p>
//             )}
//         </div>
//     );
// };

// export default ChatComponent;

import { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from './UserContext'
import Modal from './Modal'
import PrivateChatComponent from './PrivateChatComponent'
import Message from '../models/Message'
import io from 'socket.io-client'
import { GiPlayButton } from 'react-icons/gi'

// const socket = io('http://localhost:3000')
const socket = io('https://czatsportowy.pl');

const ChatComponent = ({ chatId }) => {
	const [messages, setMessages] = useState([])
	const [currentMessage, setCurrentMessage] = useState('')
	const [isPrivateChatOpen, setPrivateChatOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)
	const messagesContainerRef = useRef(null)

	useEffect(() => {
		if (messagesContainerRef.current) {
			const container = messagesContainerRef.current
			container.scrollTop = container.scrollHeight
		}
	}, [messages])

	const { token } = useContext(UserContext)
	// const socket = io('http://localhost:3000')

	const openPrivateChat = username => {
		const currentUsername = sessionStorage.getItem('username')
		if (username === currentUsername) {
			console.warn('Nie możesz otworzyć czatu z samym sobą.')
			return
		}

		setSelectedUser(username)
		setPrivateChatOpen(true)
	}

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const response = await fetch(`/api/getMessages?chatId=${chatId}`)
				const data = await response.json()
				setMessages(data)
			} catch (error) {
				console.error('Błąd podczas pobierania wiadomości:', error)
			}
		}

		fetchMessages()

		// Dołącz do pokoju czatu na podstawie chatId zaraz po połączeniu
		socket.emit('join_chat', chatId)

		socket.on('receive_message', message => {
			if (message.chatId === chatId) {
				setMessages(prevMessages => [...prevMessages, message])
			}
		})

		// return () => {
		// 	socket.off('receive_message')
		// }
		return () => {
			socket.off('receive_message');
			socket.off('join_chat');
		}
	}, [chatId])

	const handleSendMessage = async () => {
		if (currentMessage.trim()) {
			const username = sessionStorage.getItem('username') || 'Anonim'

			try {
				const response = await fetch('/api/sendMessage', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username: username,
						content: currentMessage,
						chatId: chatId,
					}),
				})

				const data = await response.json()
				if (data.success) {
					const messageObject = {
						username: username,
						content: currentMessage,
						chatId: chatId,
					}
					socket.emit('send_message', messageObject)
					setCurrentMessage('')
				} else {
					console.error(data.message)
				}
			} catch (error) {
				console.error('Błąd podczas wysyłania wiadomości:', error)
			}
		}
	}

	const formatDate = timestamp => {
		const messageDate = new Date(timestamp)
		const currentDate = new Date()

		if (
			messageDate.getDate() === currentDate.getDate() &&
			messageDate.getMonth() === currentDate.getMonth() &&
			messageDate.getFullYear() === currentDate.getFullYear()
		) {
			return `Dziś ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
		} else {
			return messageDate.toLocaleString([], {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
			})
		}
	}

	return (
		<div>
			{/* Jeśli prywatny czat jest otwarty, wyświetl modal z prywatnym czatem */}
			{isPrivateChatOpen && (
				<Modal onClose={() => setPrivateChatOpen(false)}>
					{/* <PrivateChatComponent chatId={selectedUser} /> */}
					<PrivateChatComponent receiver={selectedUser} />
				</Modal>
			)}

			<div>
				<div className='messages-container' ref={messagesContainerRef}>
					{messages.map((msg, idx) => (
						<div key={idx} className='message-one'>
							<strong onClick={() => openPrivateChat(msg.username)} style={{ cursor: 'pointer', fontWeight: '700' }}>
								{msg.username}
							</strong>
							: {msg.content}
							<span style={{ marginLeft: '10px', fontSize: '0.6em', color: 'gray' }}>{formatDate(msg.timestamp)}</span>
						</div>
					))}
				</div>
			</div>
			{token ? (
				<div className='send-public-chat'>
					<input
						value={currentMessage}
						onChange={e => setCurrentMessage(e.target.value)}
						type='text'
						placeholder='Napisz wiadomość...'
					/>
					<button onClick={handleSendMessage}>
						<GiPlayButton style={{ marginRight: '5px' }} /> Wyślij
					</button>
				</div>
			) : (
				<p className='must-be-login'>Musisz się zalogować, aby napisać wiadomość.</p>
			)}
		</div>
	)
}

export default ChatComponent
