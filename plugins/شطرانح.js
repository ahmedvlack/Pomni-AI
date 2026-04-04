async function handler(m, { conn }) {
    global.chessGames ??= {};
    if (global.chessGames[m.chat]) return m.reply("❌ توجد لعبة!");

    global.chessGames[m.chat] = {
        player1: m.sender,
        player2: null,
        turn: 'white',
        status: 'waiting',
        board: createBoard()
    };

    return conn.sendMessage(m.chat, {
        text: `♟️ تم إنشاء لعبة شطرنج\n\n@${m.sender.split('@')[0]} ينتظر لاعب...\n\nاكتب "انضم"`,
        mentions: [m.sender]
    });
}

handler.command = ['شطرنج'];
export default handler;

// 🧩 إنشاء الرقعة
function createBoard() {
    return [
        ["♜","♞","♝","♛","♚","♝","♞","♜"],
        ["♟","♟","♟","♟","♟","♟","♟","♟"],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        ["♙","♙","♙","♙","♙","♙","♙","♙"],
        ["♖","♘","♗","♕","♔","♗","♘","♖"]
    ];
}

// 🎯 اللعب
handler.before = async (m, { conn }) => {
    if (!m.text || !global.chessGames?.[m.chat]) return false;

    const game = global.chessGames[m.chat];

    // 🤝 انضمام
    if (m.text === "انضم") {
        if (game.player2) return m.reply("❌ يوجد لاعب بالفعل!");

        game.player2 = m.sender;
        game.status = 'playing';

        // 📩 شرح القطع
        await conn.sendMessage(m.chat, {
            text:
`♟️ شرح القطع:

♙ / ♟ = عسكري → خطوة للأمام
♖ / ♜ = قلعة → مستقيم
♗ / ♝ = فيل → قطري
♘ / ♞ = حصان → L
♕ / ♛ = ملكة → كل الاتجاهات
♔ / ♚ = ملك → خطوة واحدة

🎯 اللعب:
e2 e4
أو
12 28`
        });

        return conn.sendMessage(m.chat, {
            text:
`🤝 تم الانضمام!

@${game.player2.split('@')[0]} دخل اللعبة 🔥

${drawBoard(game)}

@${game.player1.split('@')[0]} ♔ ضد @${game.player2.split('@')[0]} ♚

الأبيض يبدأ`,
            mentions: [game.player1, game.player2]
        });
    }

    if (game.status !== 'playing') return false;

    const current = game.turn === 'white' ? game.player1 : game.player2;
    if (m.sender !== current) return false;

    const parts = m.text.trim().split(" ");
    if (parts.length !== 2) return false;

    let from, to;

    if (!isNaN(parts[0]) && !isNaN(parts[1])) {
        from = numberToPos(parts[0]);
        to = numberToPos(parts[1]);
    } else {
        from = parsePos(parts[0]);
        to = parsePos(parts[1]);
    }

    if (!from || !to) return m.reply("❌ مثال: e2 e4 أو 12 28");

    const piece = game.board[from.y][from.x];
    if (!piece) return m.reply("❌ لا توجد قطعة");

    if (game.turn === 'white' && isBlack(piece)) return m.reply("❌ هذه ليست قطعتك");
    if (game.turn === 'black' && isWhite(piece)) return m.reply("❌ هذه ليست قطعتك");

    const target = game.board[to.y][to.x];
    if (target && sameColor(piece, target)) return m.reply("❌ لا يمكنك أكل قطعتك");

    if (!isValidMove(game, from, to, piece)) {
        return m.reply("❌ حركت القطعه غلط يا حمار");
    }

    if (!isKnight(piece) && isBlocked(game, from, to)) {
        return m.reply("❌ الطريق مقفول");
    }

    const backup = JSON.parse(JSON.stringify(game.board));

    game.board[to.y][to.x] = piece;
    game.board[from.y][from.x] = null;

    if (isCheck(game, game.turn)) {
        game.board = backup;
        return m.reply("❌ لا يمكنك تعريض ملكك للخطر");
    }

    // ♟️ ترقية
    if (piece === "♙" && to.y === 0) game.board[to.y][to.x] = "♕";
    if (piece === "♟" && to.y === 7) game.board[to.y][to.x] = "♛";

    game.turn = game.turn === 'white' ? 'black' : 'white';

    // 👑 كش ملك
    if (isCheckmate(game, game.turn)) {
        const winner = game.turn === 'white' ? game.player2 : game.player1;

        await conn.sendMessage(m.chat, {
            text:
`🏆 انتهت اللعبة!

🎉 الفائز:
@${winner.split('@')[0]}

🔥 انت القابل تلاقي بر 😈`,
            mentions: [winner]
        });

        delete global.chessGames[m.chat];
        return true;
    }

    let msg = drawBoard(game);

    if (isCheck(game, game.turn)) {
        msg += "\n⚠️ كش! الملك هيموت 😈";
    }

    return conn.sendMessage(m.chat, {
        text: msg + `\n\nدور ${game.turn === 'white' ? "الأبيض ♔" : "الأسود ♚"}`
    });
};

// 📍 تحويل
function parsePos(pos) {
    const letters = "abcdefgh";
    return {
        x: letters.indexOf(pos[0]),
        y: 8 - parseInt(pos[1])
    };
}

function numberToPos(num){
    num = parseInt(num) - 1;
    return {
        x: num % 8,
        y: Math.floor(num / 8)
    };
}

// 🎨 رسم
function drawBoard(game){
    let out="  a b c d e f g h\n";
    let num = 1;

    for(let y=0;y<8;y++){
        out+=(8-y)+" ";
        for(let x=0;x<8;x++){
            out += (game.board[y][x] || num) + " ";
            num++;
        }
        out+="\n";
    }

    out += "\n(عد المربعات و اكتب الرقم صح و كلمه للحركة)";
    return out;
}

// 🧠 أدوات
function isWhite(p){ return "♙♖♘♗♕♔".includes(p); }
function isBlack(p){ return "♟♜♞♝♛♚".includes(p); }
function sameColor(a,b){ return (isWhite(a)&&isWhite(b))||(isBlack(a)&&isBlack(b)); }
function isKnight(p){ return p==="♘"||p==="♞"; }

// 🚫 منع المرور
function isBlocked(game, from, to){
    let dx = Math.sign(to.x - from.x);
    let dy = Math.sign(to.y - from.y);

    let x = from.x + dx;
    let y = from.y + dy;

    while (x !== to.x || y !== to.y){
        if (game.board[y][x]) return true;
        x += dx;
        y += dy;
    }
    return false;
}

// 👑 كش
function isCheck(game, color){
    let king;

    for (let y=0;y<8;y++){
        for (let x=0;x<8;x++){
            if (game.board[y][x] === (color==="white"?"♔":"♚")) {
                king = {x,y};
            }
        }
    }

    for (let y=0;y<8;y++){
        for (let x=0;x<8;x++){
            let p = game.board[y][x];
            if (!p) continue;

            if (color==="white" && isBlack(p)) {
                if (isValidMove(game,{x,y},king,p)) return true;
            }
            if (color==="black" && isWhite(p)) {
                if (isValidMove(game,{x,y},king,p)) return true;
            }
        }
    }

    return false;
}

// 👑 كش ملك
function isCheckmate(game, color){
    if (!isCheck(game, color)) return false;

    for (let y=0;y<8;y++){
        for (let x=0;x<8;x++){
            let p = game.board[y][x];
            if (!p) continue;

            if (color==="white" && !isWhite(p)) continue;
            if (color==="black" && !isBlack(p)) continue;

            for (let yy=0;yy<8;yy++){
                for (let xx=0;xx<8;xx++){

                    if (!isValidMove(game,{x,y},{x:xx,y:yy},p)) continue;

                    let backup = JSON.parse(JSON.stringify(game.board));

                    game.board[yy][xx] = p;
                    game.board[y][x] = null;

                    if (!isCheck(game, color)) {
                        game.board = backup;
                        return false;
                    }

                    game.board = backup;
                }
            }
        }
    }

    return true;
}

// 🎯 قوانين الحركة
function isValidMove(game, from, to, piece){
    let dx = to.x - from.x;
    let dy = to.y - from.y;
    let ax = Math.abs(dx);
    let ay = Math.abs(dy);

    switch(piece){
        case "♙": return dx===0 && dy===-1;
        case "♟": return dx===0 && dy===1;

        case "♖": case "♜":
            return dx===0 || dy===0;

        case "♗": case "♝":
            return ax===ay;

        case "♘": case "♞":
            return (ax===2 && ay===1)||(ax===1 && ay===2);

        case "♕": case "♛":
            return ax===ay || dx===0 || dy===0;

        case "♔": case "♚":
            return ax<=1 && ay<=1;
    }

    return false;
}
