import { useState, useEffect, useContext } from 'react' // Dodaj useEffect
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { UserContext } from '@/components/UserContext'

export default function Home() {
	const [expandedSport, setExpandedSport] = useState(null)
	const { token } = useContext(UserContext)

	// useEffect(() => {
	//     // Inicjalizacja tokenu z sessionStorage na starcie
	//     setToken(sessionStorage.getItem('token'));
	// }, []);

	return (
		<div className='all'>
			<NavBar />

			<div className='content'>
				<h2>Kategorie sportów</h2>

				<div
					className='sport-category'
					onClick={() => setExpandedSport(expandedSport !== 'pilka-nozna' ? 'pilka-nozna' : null)}>
					<div className='sport-name'>
						<img src='/img/football.png' className='icon-sport' /> Piłka Nożna
					</div>
					{expandedSport === 'pilka-nozna' && (
						<ul className='country-league'>
							<li>
								<img src='/img/pol.png' className='icon-country' />
								<Link href='/pilka-nozna/liga-polska'>PKO BP Ekstraklasa</Link>
							</li>
							{/* Dodaj więcej lig w przyszłości jeśli potrzebujesz */}
						</ul>
					)}
				</div>

				<div className='sport-category' onClick={() => setExpandedSport(expandedSport !== 'hokej' ? 'hokej' : null)}>
					<div className='sport-name'>
						<img src='/img/ice-hockey.png' className='icon-sport' />
						Hokej
					</div>
					{expandedSport === 'hokej' && (
						<ul className='country-league'>
							<li>
								<img src='/img/usa.png' className='icon-country' />
								<Link href='/hokej/nhl'>NHL</Link>
							</li>
						</ul>
					)}
				</div>
			</div>

			{/* Jeśli chcesz dodać więcej kategorii sportów, po prostu powtórz powyższy wzorzec */}
		</div>
	)
}
