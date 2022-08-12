const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
    ]
});

const fs = require('fs');

let lectureFile = fs.readFileSync('./lectures.json');

let lectureE = new MessageEmbed();
let commandE = new MessageEmbed();

commandE
    .setColor('#ff9696')
    .setTitle('**명령어**')
    .addFields(
        { name: '!명령어', value: '명령어를 검색합니다.' },
        { name: '!강의 조회', value: '강의를 조회합니다.' },
        { name: '!강의 추가 \'강의\'  \'계정\'  \'비번\'  \'계정주인\'  \'링크\'', value: '강의를 추가합니다.' },
        { name: '!강의 삭제 \'인덱스번호\'', value: '해당 강의를 삭제합니다.' },
    )
    .setFooter({ text: 'made by SEH00N' });

lectureE
    .setColor('#ff9696')
    .setTitle('**강의목록**')
    .setFooter({ text: 'made by SEH00N' });

const prefix = '!';

client.once('ready', () => {
    console.log('접속 성공');
    client.user.setActivity('!명령어', { tpye: 'PLAYING' });
    if (lectureFile[0] != null) {
        JSON.parse(lectureFile).forEach(element => {
            lectureE.addFields(element);
        });
    }
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.split(prefix)[1];
    const command = args.split(' ')[0];
    const contents = args.split(' ')[1];
    switch (command) {
        case '명령어':
            message.channel.send({ embeds: [commandE] });
            break;
        case '강의':
            LectureInfo(contents, args, message);
            break;
    }
});

function LectureInfo(contents, args, message) {
    switch (contents) {
        case '조회':
            message.channel.send({ embeds: [lectureE] });
            break;
        case '추가':
            AddLecture(args, message);
            break;
        case '삭제':
            RemoveLecture(args, message);
            break;
    }
}

function save() {
    fs.writeFileSync('./lectures.json', JSON.stringify(lectureE.fields));
}

//#region :LectureInformation:
function AddLecture(temp, message) {
    const title = temp.split(' ')[2];
    const account = temp.split(' ')[3];
    const password = temp.split(' ')[4];
    const owner = temp.split(' ')[5];
    const link = temp.split(' ')[6];
    if (title == null || account == null || password == null || owner == null || link == null) { message.reply('명령어를 확인해주세요.'); return; }
    if (temp.split(' ')[7] != null) { message.reply('띄어쓰기를 확인해주세요.'); return; }

    lectureE.addFields({ name: `${title}`, value: `계정: ${account}\n비번: ${password}\n계정주인: ${owner}\n링크: ${link}` });
    save();

    message.channel.send({ embeds: [lectureE] });
}

function RemoveLecture(temp, message) {
    const index = temp.split(' ')[2];
    if (index == null || lectureE.fields[index] == null || temp.split(' ')[3] != null) { message.reply('명령어를 확인해주세요.'); return; }

    lectureE.spliceFields(index, 1);
    save();

    message.channel.send({ embeds: [lectureE] });
}
//#endregion
client.login(require('D:\\tokens\\tokens.json').udemyToken);