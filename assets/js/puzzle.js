// Paul Morphy's mate in two: 1.Ra6! and Black is helpless.
//   1...bxa6 2.b7#   or   1...B(any) 2.Rxa7#
import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.0.0/dist/esm/chess.js';

const root = document.getElementById('puzzle');
const FEN = 'kbK5/pp6/1P6/8/8/8/8/R7 w - - 0 1';
const KEY = 'Ra6';
const NAMES = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
const FILES = 'abcdefgh';

const boardEl = root.querySelector('.board');
const statusEl = root.querySelector('.puzzle-status');
const squares = {};   // square name -> button
let pieces = [];      // { el, sq, type, color }
let game, selected, busy, solved, lastMove;

// ---------- board ----------
for (let r = 8; r >= 1; r--) {
    for (let f = 0; f < 8; f++) {
        const sq = FILES[f] + r;
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'sq ' + ((f + r) % 2 ? 'dark' : 'light');
        el.setAttribute('aria-label', sq);
        el.addEventListener('click', () => click(sq));
        boardEl.appendChild(el);
        squares[sq] = el;
    }
}

function place(el, sq) {
    const f = FILES.indexOf(sq[0]);
    const r = +sq[1];
    el.style.transform = `translate(${f * 100}%, ${(8 - r) * 100}%)`;
}

// Bring the piece layer in line with the game, moving existing pieces where
// possible so the browser animates them instead of redrawing.
function sync() {
    const want = [];
    for (const row of game.board()) for (const p of row) if (p) want.push(p);

    const keep = [];
    let spare = [...pieces];
    // pieces that didn't move stay put
    for (const w of [...want]) {
        const i = spare.findIndex(p => p.sq === w.square && p.type === w.type && p.color === w.color);
        if (i >= 0) {
            keep.push(spare[i]);
            spare.splice(i, 1);
            want.splice(want.indexOf(w), 1);
        }
    }
    // pieces that moved slide to their new square
    for (const w of want) {
        const i = spare.findIndex(p => p.type === w.type && p.color === w.color);
        let p;
        if (i >= 0) {
            p = spare.splice(i, 1)[0];
        } else {
            const el = document.createElement('piece');
            el.className = `${NAMES[w.type]} ${w.color === 'w' ? 'white' : 'black'} appear`;
            boardEl.appendChild(el);
            p = { el, type: w.type, color: w.color };
            requestAnimationFrame(() => el.classList.remove('appear'));
        }
        p.sq = w.square;
        place(p.el, p.sq);
        keep.push(p);
    }
    // captured pieces fade out
    for (const p of spare) {
        p.el.classList.add('captured');
        setTimeout(() => p.el.remove(), 250);
    }
    pieces = keep;
    paint();
}

function paint() {
    const targets = selected ? game.moves({ square: selected, verbose: true }) : [];
    const mated = game.isCheckmate() ? findKing(game.turn()) : null;
    for (const [sq, el] of Object.entries(squares)) {
        const t = targets.find(m => m.to === sq);
        el.classList.toggle('sel', sq === selected);
        el.classList.toggle('last', lastMove.includes(sq));
        el.classList.toggle('dot', !!t && !t.captured);
        el.classList.toggle('cap', !!t && !!t.captured);
        el.classList.toggle('mated', sq === mated);
        const p = game.get(sq);
        el.setAttribute('aria-label', sq + (p ? ` ${p.color === 'w' ? 'white' : 'black'} ${NAMES[p.type]}` : ''));
    }
}

function findKing(color) {
    for (const row of game.board()) for (const p of row) if (p && p.type === 'k' && p.color === color) return p.square;
}

// ---------- play ----------
function status(text, cls) {
    statusEl.textContent = text;
    statusEl.className = 'puzzle-status' + (cls ? ' ' + cls : '');
}

function play(from, to) {
    const m = game.move({ from, to, promotion: 'q' });
    lastMove = [from, to];
    selected = null;
    sync();
    return m;
}

function takeBack(msg) {
    busy = true;
    status(msg, 'bad');
    setTimeout(() => {
        game.undo();
        lastMove = [];
        sync();
        busy = false;
    }, 600);
}

function click(sq) {
    if (busy || solved) return;
    const p = game.get(sq);
    if (p && p.color === 'w') {
        selected = selected === sq ? null : sq;
        paint();
        return;
    }
    if (!selected) return;
    if (!game.moves({ square: selected, verbose: true }).some(m => m.to === sq)) {
        selected = null;
        paint();
        return;
    }

    const m = play(selected, sq);
    const firstMove = game.history().length === 1;

    if (firstMove && m.san !== KEY) return takeBack('Not quite. Try again!');
    if (!firstMove && !game.isCheckmate()) return takeBack('Close, but that’s not mate. Try again!');

    if (game.isCheckmate()) {
        solved = true;
        const h = game.history();
        status(`Checkmate! 1.${h[0]}! ${h[1]} 2.${h[2]}`, 'good');
        return;
    }

    // Black answers: take the rook, or move the bishop and hope
    busy = true;
    status('1.Ra6! A quiet rook sacrifice. Black replies…');
    setTimeout(() => {
        const replies = game.moves({ verbose: true });
        const take = replies.filter(r => r.captured);
        const other = replies.filter(r => !r.captured);
        const pool = take.length && (Math.random() < .5 || !other.length) ? take : other;
        const r = pool[Math.floor(Math.random() * pool.length)];
        play(r.from, r.to);
        busy = false;
        status(`Black played ${r.san}. Now find the mate.`);
    }, 700);
}

function reset() {
    game = new Chess(FEN);
    selected = null;
    busy = false;
    solved = false;
    lastMove = [];
    status('White to move. Click a piece to see where it can go.');
    sync();
}

root.querySelector('.puzzle-reset').addEventListener('click', reset);
reset();
