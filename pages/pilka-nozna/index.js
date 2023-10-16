// pages/pilka-nozna/index.js

import Link from 'next/link';

export default function PilkaNozna() {
    return (
        <div>
            <h1>Wybierz ligę:</h1>
            <ul>
                <li><Link href="/pilka-nozna/liga-polska">Liga Polska</Link></li>
            </ul>
        </div>
    );
}
