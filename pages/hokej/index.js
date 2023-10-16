import Link from 'next/link';

export default function Hokej() {
    return (
        <div>
            <h1>Wybierz ligę:</h1>
            <ul>
                <li><Link href="/hokej/nhl">NHL</Link></li>
            </ul>
        </div>
    );
}