// Paul Morphy's mate in two: 1.Ra6! and Black is helpless.
//   1...bxa6 2.b7#   or   1...B(any) 2.Rxa7#
(function () {
    const root = document.getElementById('puzzle');
    if (!root) return;

    const START = { a8: 'bK', b8: 'bB', a7: 'bP', b7: 'bP', c8: 'wK', b6: 'wP', a1: 'wR' };
    // ︎ keeps Windows from drawing the pawn as a coloured emoji
    const GLYPH = { K: '♚', B: '♝', P: '♟︎', R: '♜' };
    const FILES = 'abcdefgh';

    // black's possible replies to 1.Ra6, each with the move that mates
    const LINES = [
        { reply: ['b7', 'a6'], mate: 'b6b7', san: '1...bxa6 2.b7#' },
        { reply: ['b8', 'c7'], mate: 'a6a7', san: '1...Bc7 2.Rxa7#' },
    ];

    const boardEl = root.querySelector('.board');
    const statusEl = root.querySelector('.puzzle-status');
    let pos, selected, stage, line, lastMove;

    function reset() {
        pos = { ...START };
        selected = null;
        stage = 0;
        line = null;
        lastMove = [];
        status('White to move. Click a piece, then a square.');
        draw();
    }

    function status(text, cls) {
        statusEl.textContent = text;
        statusEl.className = 'puzzle-status' + (cls ? ' ' + cls : '');
    }

    function move(from, to) {
        pos[to] = pos[from];
        delete pos[from];
        lastMove = [from, to];
    }

    function draw() {
        boardEl.innerHTML = '';
        for (let r = 8; r >= 1; r--) {
            for (let f = 0; f < 8; f++) {
                const sq = FILES[f] + r;
                const el = document.createElement('button');
                el.type = 'button';
                el.className = 'sq ' + ((f + r) % 2 ? 'dark' : 'light');
                if (sq === selected) el.classList.add('sel');
                if (lastMove.includes(sq)) el.classList.add('last');
                el.setAttribute('aria-label', sq + (pos[sq] ? ' ' + pos[sq] : ''));
                const p = pos[sq];
                if (p) {
                    const span = document.createElement('span');
                    span.className = 'pc ' + (p[0] === 'w' ? 'white' : 'black');
                    span.textContent = GLYPH[p[1]];
                    el.appendChild(span);
                }
                el.addEventListener('click', () => click(sq));
                boardEl.appendChild(el);
            }
        }
    }

    function click(sq) {
        if (stage === 1 || stage === 3) return; // waiting for black, or solved
        if (pos[sq] && pos[sq][0] === 'w') {
            selected = selected === sq ? null : sq;
            draw();
            return;
        }
        if (!selected) return;
        const tried = selected + sq;
        selected = null;

        const want = stage === 0 ? 'a1a6' : line.mate;
        if (tried !== want) {
            status('Not quite. Try again!', 'bad');
            draw();
            return;
        }

        move(tried.slice(0, 2), tried.slice(2));
        draw();
        if (stage === 0) {
            stage = 1;
            status('1.Ra6! A quiet rook sacrifice. Black replies…');
            setTimeout(() => {
                line = LINES[Math.floor(Math.random() * LINES.length)];
                move(line.reply[0], line.reply[1]);
                stage = 2;
                status('Black played ' + line.san.split(' ')[0].slice(4) + '. Now find the mate.');
                draw();
            }, 700);
        } else {
            stage = 3;
            status('Checkmate! 1.Ra6! ' + line.san.replace('1...', '') + ' (Paul Morphy)', 'good');
        }
    }

    root.querySelector('.puzzle-reset').addEventListener('click', reset);
    reset();
})();
