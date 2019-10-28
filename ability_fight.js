//□■ <<-- 체력, 경험치 바
//version Development 1.0.1
var gameStart = false;
var tickCount = 0;
var gameTime = 0;

var player = new Array();
var op = new Array();
var user = new Array();
var userEnt = new Array();

var stat = new Array();

var spawnPointCount = 0;
var spawnPoint = new Array();

var killGoal = 0;
var abilityCount = 11;

var entityName = ["chicken", "cow", "pig", "sheep", "wolf", "villager", "mooshroom", "squid"];


eval(function (p, a, c, k, e, r) { e = function (c) { return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)) }; if (!''.replace(/^/, String)) { while (c--) r[e(c)] = k[c] || e(c); k = [function (e) { return r[e] }]; e = function () { return '\\w+' }; c = 1 }; while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]); return p }('D(y(p,a,c,k,e,r){e=y(c){z c.J(a)};A(!\'\'.B(/^/,E)){C(c--)r[e(c)]=k[c]||e(c);k=[y(e){z r[e]}];e=y(){z\'\\\\w+\'};c=1};C(c--)A(k[c])p=p.B(F G(\'\\\\b\'+e(c)+\'\\\\b\',\'g\'),k[c]);z p}(\'j(8(p,a,c,k,e,r){e=d;f(!\\\'\\\'.h(/^/,d)){i(c--)r[c]=k[c]||c;k=[8(e){9 r[e]}];e=8(){9\\\'\\\\\\\\w+\\\'};c=1};i(c--)f(k[c])p=p.h(l m(\\\'\\\\\\\\b\\\'+e(c)+\\\'\\\\\\\\b\\\',\\\'g\\\'),k[c]);9 p}(\\\'0("\\\\\\\\1 2 3\\\\\\\\4 5 6");\\\',7,7,\\\'n|o|q|s|t|u|v\\\'.x(\\\'|\\\'),0,{}))\',H,H,\'||||||||y|z||||E||A||B|C|D||F|G|K|L||M||N|O|P|Q||I\'.I(\'|\'),0,{}))', 53, 53, '||||||||||||||||||||||||||||||||||function|return|if|replace|while|eval|String|new|RegExp|34|split|toString|print|nMade|by|namsic|nAll|rights|reserved'.split('|'), 0, {}))

var x, y, z;
var sk3T;
var sk3 = [0, 0];
var sk3L = [0, 0, 0];
var sk3C = 0;

function modTick() {
    if (gameStart) {
        for (var u in user) {       //모든 유저 대상
            if (stat[u].reviveTime <= gameTime) {        //살아있는 유저 대상
                if (stat[u].reviveTime == gameTime && tickCount == 19) revive(u);    //부활
                if (stat[u].exp >= nexp(stat[u].lv)) lvUp(u);                    //레벨업
                if (stat[u].bonusExp <= gameTime && tickCount == 0) bonusExpChance(u);       //보너스 경험치

                if (gameTime % 5 == 0 && gameTime != 0 && tickCount == 0) {       //5초마다 실행
                    if (stat[u].hp < stat[u].maxHp) {
                        if (stat[u].ab == 6) stat[u].hp += (stat[u].maxHp * 6 / 100).toFixed(0);
                        else stat[u].hp++;
                    }
                }

                if (stat[u].hp > stat[u].maxHp) stat[u].hp = stat[u].maxHp;
                if (stat[u].mana > stat[u].maxMana) stat[u].mana = stat[u].maxMana;
            }

            if (stat[u].reviveTime > gameTime && tickCount == 19) deathMessage(u)        //사망시 메세지

            if (stat[u].cool == undefined || isNaN(stat[u].cool)) stat[u].cool = stat[u].maxCool;
            if (stat[u].cool > 0) stat[u].cool -= 1;
            if (stat[u].cool < 0) stat[u].cool = 0;

            if (stat[u].ab == 1){       //점멸 후속타
                if(stat[u].cool == stat[u].maxCool - 5) {
                    for (var e in userEnt) {
                        if (userEnt[e] != userEnt[u]) {
                            if (inRange(userEnt[u], userEnt[e], 3.5)) skillHit(userEnt[u], userEnt[e], 1.2);
                        }
                    }
                }
            }
            else if (stat[u].ab == 3) {     //자기장
                if (stat[u].cool > stat[u].maxCool - 60) {      //자기장 파티클
                    for (var i = 0; i < 2; i++) {
                        sk3C += 3;
                        x = sk3L[0] + (Math.cos(Math.PI / 180.0 * sk3C) * 5);
                        y = sk3L[1];
                        z = sk3L[2] + (Math.sin(Math.PI / 180.0 * sk3C) * 5);
                        particle("basic_portal_particle", x, y, z);
                    }
                }
                if(stat[u].cool == stat[u].maxCool - 60) {      //자기장 대상 지정
                    rangeTellraw(user[u], "자기장 발동!", 20);
                    sk3[0] = gameTime + 6;
                    sk3[1] = tickCount;
                    sk3T = new Array();

                    for (var e in userEnt) {
                        if (userEnt[e] != userEnt[u]) {
                            if (inRange_(sk3L[0], sk3L[1], sk3L[2], userEnt[e], 5)) {
                                sk3T.push(userEnt[e]);
                                Level.executeCommand("/effect " + user[e] + " levitation 6 0");
                            }
                        }
                    }
                }

                if (((sk3[0] * 20) + sk3[1]) >= ((gameTime * 20) + tickCount) && (((sk3[0] * 20 + sk3[1]) - ((gameTime * 20) + tickCount)) % 15 == 0)) {        //자기장 데미지
                    for(var e in sk3T) skillHit(userEnt[u], sk3T[e], 1);
                }
            }
        }

        if (tickCount % 4 == 0) playerStatUI();        //0.2초마다 실행

        tickCount++;

        if (tickCount == 20) {
            tickCount = 0;
            gameTime++;
        }

        if (gameTime % 60 == 0 && gameTime != 0 && tickCount == 0) killRank();        //1분마다 실행 - 킬 1등 출력
    }
}


function entityAddedHook(entity) {
    if (gameStart) {
        var eId = Entity.getEntityTypeId(entity);
        var uIdx;

        switch (eId) {
            case 10:        //점멸 스킬 사용
                for(var u in user) {
                    if(stat[u].ab == 1) {
                        uIdx = u;
                        break;
                    }
                }

                Level.executeCommand("/give " + user[uIdx] + " spawn_egg 1 " + eId);

                if(stat[uIdx] != undefined) {
                    if (stat[uIdx].cool == 0) {
                        stat[uIdx].cool = stat[uIdx].maxCool;

                        rangeTellraw(user[uIdx], "점멸!", 20);

                        for (var e in userEnt) {
                            if (userEnt[e] != userEnt[uIdx]) {
                                if (inRange(userEnt[uIdx], userEnt[e], 3)) skillHit(userEnt[uIdx], userEnt[e], 0.8);
                            }
                        }

                        rateTp(userEnt[uIdx], entity, entityName[0], 12);
                    }
                    else{
                        if(stat[uIdx].cool != 0){
                            Level.executeCommand("/tp @e[type=" + entityName[0] + "] 0 -10 0");
                            tellraw(user[uIdx], "해당 스킬의 쿨타임은 " + (stat[uIdx].cool / 20) + "초 남았습니다");
                        }
                    }
                }

                break;

            case 12:        //자기장 스킬 사용
                for(var u in user) {
                    if(stat[u].ab == 3) {
                        uIdx = u;
                        break;
                    }
                }

                Level.executeCommand("/give " + user[uIdx] + " spawn_egg 1 " + eId);

                if(stat[uIdx] != undefined) {
                    if(stat[uIdx].cool == 0) {
                        stat[uIdx].cool = stat[uIdx].maxCool;

                        var location = getRangeLocation(userEnt[uIdx], entity, entityName[2], 10);
                        sk3L[0] = location[0];
                        sk3L[1] = Entity.getY(userEnt[uIdx]);
                        sk3L[2] = location[1];

                        for (var i = 0; i < 10; i++)
                            particle("magnesium_salts_emitter", sk3L[0], sk3L[1], sk3L[2]);
                    }
                    else{
                        if(stat[uIdx].cool != 0){
                            Level.executeCommand("/tp @e[type=" + entityName[2] + "] 0 -10 0");
                            tellraw(user[uIdx], "해당 스킬의 쿨타임은 " + (stat[uIdx].cool / 20) + "초 남았습니다");
                        }
                    }
                }
                
                break;
        }
    }
}


function procCmd(cmd){
    Cmd = cmd.split(" ");
    if (Cmd[0] == "ab_fight") {
        if (Cmd[1] == "player_add") {       //플레이어 추가
            if (gameStart == false) {
                if (player.indexOf(Cmd[2]) == -1) {
                    player.push(cmd.replace("ab_fight player_add ", ""));
                    tellraw(player[0], "player_add 발동 완료");
                }
                else tellraw(player[0], "해당 플레이어는 이미 플레이어로 인식되어 있습니다");
            }
            else tellraw(player[0], "게임이 이미 진행중이기 때문에 설정할 수 없습니다");
        }

        else if (Cmd[1] == "player_remove") {       //플레이어 삭제
            if (player.indexOf(Cmd[2]) != -1) {
                player.splice(player.indexOf(cmd.replace("ab_fight player_add ", "")), 1);
                tellraw(player[0], "player_remove 발동 완료")
            }
            else tellraw(player[0], "해당 플레이어는 이미 플레이어로 인식되어있지 않습니다")
        }

        else if (Cmd[1] == "players") {     //플레이어 목록
            Level.executeCommand("/say --------------------------------");
            Level.executeCommand("/say 플레이어 목록");
            for (var i = 1; i <= player.length; i++) Level.executeCommand("/say " + i + "번 " + player[i - 1]);
            Level.executeCommand("/say --------------------------------");
        }

        else if (Cmd[1] == "users") {
            Level.executeCommand("/say --------------------------------");
            Level.executeCommand("/say 유저 목록");
            for (var i = 1; i <= user.length; i++) Level.executeCommand("/say " + i + "번 " + user[i - 1]);
            Level.executeCommand("/say --------------------------------");
        }

        else if (Cmd[1] == "start") {       //게임 시작
            if (!gameStart) {
                Level.executeCommand("/gamerule commandblockoutput false");
                Level.executeCommand("/gamerule sendcommandfeedback false");

                var allPlayerEnt = Server.getAllPlayers();

                for (var p in player) {
                    if (op.indexOf(player[p]) == -1) {     //관리자가 아닌 플레이어들을 유저로 추가
                        user.push(player[p]);
                        stat.push(new mkUser);

                        Level.executeCommand("/clear " + user[p] + " spawn_egg");

                        for (var e in allPlayerEnt) {
                            if (Player.getName(allPlayerEnt[e]) == player[p]) {
                                userEnt.push(allPlayerEnt[e]);
                                break;
                            }
                        }

                        Level.executeCommand("/effect " + player[p] + " saturation 999999 0 true");
                        Level.executeCommand("/effect " + player[p] + " resistance 999999 255 true");
                        Level.executeCommand("/gamemode 0 " + player[p]);
                    }
                    else Level.executeCommand("/gamemode 1 " + player[p]);      //관리자는 게임모드로
                }

                abilityRoulette();
                gameStart = true;
                Level.executeCommand("/say 게임이 시작되었습니다");
            }
            else tellraw(player[0], "이미 게임이 시작되어있습니다");
        }

        else if (Cmd[1] == "stop") {        //게임 중지
            if (gameStart) {
                gameStart = false;
                tickCount = 0;
                gameTime = 0;
                Level.executeCommand("/say 게임이 중지되었습니다");

                for (var u in user) {
                    Level.executeCommand("/effect " + user[u] + " resistance 0");
                    Level.executeCommand("/clear " + user[u] + " spawn_egg");
                }

                user = new Array();
                userEnt = new Array();
                stat = new Array();
            }
            else tellraw(player[0], "게임이 시작되지 않았습니다");
        }

        else if (Cmd[1] == "pause") {       //게임 일시 중지
            if (gameStart) {
                gameStart = false;
                Level.executeCommand("/say 게임이 일시중지되었습니다");
            }
            else tellraw(player[0], "게임이 시작되지 않았습니다");
        }

        else if (Cmd[1] == "resume") {      //게임 재시작
            if (!gameStart) {
                gameStart = true;
                Level.executeCommand("/say 게임이 재시작되었습니다");
            }
            else tellraw(player[0], "이미 게임이 시작되어있습니다");
        }

        else if (Cmd[1] == "op") {
            if (gameStart == false) {
                if (op.indexOf(cmd.replace("ab_fight op ", "")) == -1) {     //유저 -> 관리자
                    op.push(cmd.replace("ab_fight op ", ""));
                    tellraw(player[0], cmd.replace("ab_fight op ", "") + "이(가) ab_Fight 의 유저에서 제외되었습니다");
                }
                else tellraw(player[0], cmd.replace("ab_fight op ", "") + "이(가) 이미 ab_Fight 유저에 제외되어 있습니다");
            }
            else tellraw(player[0], "게임이 이미 진행중이기 때문에 설정할 수 없습니다");
        }
        else if (Cmd[1] == "deop") {        //관리자 -> 유저
            if (gameStart == false) {
                if (op.indexOf(cmd.replace("ab_fight deop ", "")) != -1) {
                    op.splice(op.indexOf(cmd.replace("ab_fight deop ", "")), 1);
                    tellraw(player[0], cmd.replace("ab_fight deop ", "") + "이(가) ab_Fight 의 유저에 포함되었습니다");
                }
                else tellraw(player[0], cmd.replace("ab_fight deop ", "") + "이(가) 이미 ab_Fight 유저에 포함되어 있습니다");
            }
            else tellraw(player[0], "게임이 이미 진행중이기 때문에 설정할 수 없습니다");
        }

        else if (Cmd[1] == "spawnpoint_add") {      //스폰포인트 추가
            for (var i = 0; i < spawnPointCount; i++) {
                if (spawnPoint[i].x == Cmd[2] && spawnPoint[i].y == Cmd[3] && spawnPoint[i].z == Cmd[4]) {
                    tellraw(player[0], "이미 해당 지점은 스폰포인트로 등록되어 있습니다");
                    return;
                }
            }

            spawnPoint.push(new mkSpawnPoint(Cmd[2], Cmd[3], Cmd[4]));
            spawnPointCount++;

            tellraw(player[0], "스폰포인트가 X : " + Cmd[2] + ", Y : " + Cmd[3] + ", Z : " + Cmd[4] + " 위치에 추가되었습니다");
            tellraw(player[0], "현재 스폰포인트 개수 : " + spawnPointCount + "개");
        }

        else if (Cmd[1] == "spawnpoint_remove") {       //스폰포인트 제거
            if (Cmd[2] <= spawnPointCount) {
                spawnPoint.splice(Cmd[2] - 1, 1);
                spawnPointCount--;
                tellraw(player[0], "스폰포인트 제거가 완료되었습니다");
            }
            else tellraw(player[0], "해당 번호의 스폰포인트는 존재하지 않습니다");
        }

        else if (Cmd[1] == "spawnpoints") {      //스폰포인트 목록
            for(var i = 0; i < spawnPointCount; i++) tellraw(player[0], "[" + (parseInt(i) + 1) + "]번 x : " + spawnPoint[i].x + ", y : " + spawnPoint[i].y + ", z : " + spawnPoint[i].z);
        }

        else if (Cmd[1] == "killGoal") {
            if(!isNaN(Cmd[2])){
                killGoal = ((Number)(Cmd[2])).toFixed(0);
                Level.executeCommand("/say 킬 목표가 " + killGoal + "(으)로 설정되었습니다");
            }
            else tellraw(player[0], "킬 목표는 숫자여야합니다");
        }

        else if (Cmd[1] == "test") {        //테스트
            if (Cmd[2] == "time") {
                gameTime = Cmd[3];
                Level.executeCommand("/say 현재 게임 시간 : " + gameTime);
            }
            else if (Cmd[2] == "ent") {
                for (var e in userEnt) tellraw(player[0], userEnt[e]);
            }
            else {
                var name = "";
                for(var i = 3; i < Cmd.length - 1; i++) name += Cmd[i] + " ";
                name = name.trim();
                
                var num = ((Number)(Cmd[Cmd.length - 1]));
                var idx = user.indexOf(name);

                if (idx != -1) {
                    if (Cmd[2] == "maxhp") {
                        stat[idx].maxHp = num;
                        tellraw(player[0], user[idx] + " 의 최대체력 : " + stat[idx].maxhp);
                    }
                    else if (Cmd[2] == "hp") {
                        stat[idx].hp = num;
                        tellraw(player[0], user[idx] + " 의 체력 : " + stat[idx].hp);
                    }
                    else if (Cmd[2] == "maxmana") {
                        stat[idx].maxMana = num;
                        tellraw(player[0], user[idx] + " 의 최대마나 : " + stat[idx].maxMana);
                    }
                    else if (Cmd[2] == "mana") {
                        stat[idx].mana = num;
                        tellraw(player[0], user[idx] + " 의 마나 : " + stat[idx].mana);
                    }
                    else if (Cmd[2] == "atk") {
                        stat[idx].atk = num;
                        tellraw(player[0], user[idx] + " 의 공격력 : " + stat[idx].atk);
                    }
                    else if (Cmd[2] == "cri") {
                        stat[idx].cri = num;
                        tellraw(player[0], user[idx] + " 의 치명타확률 : " + stat[idx].cri);
                    }
                    else if (Cmd[2] == "crid") {
                        stat[idx].crid = num;
                        tellraw(player[0], user[idx] + " 의 치명타데미지 : " + stat[idx].crid);
                    }
                    else if (Cmd[2] == "exp") {
                        stat[idx].exp = num;
                        tellraw(player[0], user[idx] + " 의 경험치 : " + stat[idx].exp);
                    }
                    else if (Cmd[2] == "lv") {
                        stat[idx].lv = num;
                        tellraw(player[0], user[idx] + " 의 레벨 : " + stat[idx].lv);
                    }
                    else if (Cmd[2] == "cool") {
                        stat[idx].cool = num;
                        tellraw(player[0], user[idx] + " 의 쿨타임 : " + stat[idx].cool + "초");
                    }
                }
                else tellraw(player[0], "정확한 이름을 입력해주세요 (입력된 이름 : " + name + ")");
            }
        }
    }
}


function attackHook(a, v) {
    var aIdx = user.indexOf(Player.getName(a));
    var vIdx = user.indexOf(Player.getName(v));

    if (gameStart) {
        if (aIdx == -1 || vIdx == -1) return;

        if (stat[vIdx].reviveTime + 1 < gameTime) attack(a, v);
    }
}

function playerStatUI() {
    var str;
    var i;

    for (var u in user) {       //스탯 UI
        str = "/title " + user[u] + " actionbar §l§6";

        for(i = 0; i < Math.floor(Math.round((stat[u].exp / nexp(stat[u].lv)).toFixed(2) * 100) / 5); i++) str += "■";
        for(;i < 20; i++) str += "□";
        str += " [" + stat[u].lv + "LV] (" + stat[u].exp + "/" + nexp(stat[u].lv) + " : " + Math.round((stat[u].exp / nexp(stat[u].lv)).toFixed(2) * 100) + "٪)\u000a" + "§c";
        
        for(i = 0; i < Math.ceil(Math.round((stat[u].hp / stat[u].maxHp).toFixed(2) * 100) / 5); i++) str += "■";
        for(;i < 20; i++) str += "□";
        str += " (" + stat[u].hp + "/" + stat[u].maxHp + ") (" + Math.round((stat[u].hp / stat[u].maxHp).toFixed(2) * 100) + "٪)\u000a" + "§b";
        
        for(i = 0; i < Math.ceil(Math.round((stat[u].mana / stat[u].maxMana).toFixed(2) * 100) / 5); i++) str += "■";
        for(;i < 20; i++) str += "□";
        str += " (" + stat[u].mana + "/" + stat[u].maxMana + ") (" + Math.round((stat[u].mana / stat[u].maxMana).toFixed(2)) * 100 + "٪)\u000a";

        str += "§4공격력 : " + stat[u].atk + "  " + "§e치명타데미지 : " + stat[u].crid + "٪ (" + stat[u].cri + "٪)";

        Level.executeCommand(str);
    }
}

function nexp(lv) {
    if (lv < 5)
        return ((Number)(lv * 10));
    else if (lv < 10)
        return ((Number)(lv * 12));
    else if (lv < 20)
        return ((Number)(lv * 14));
    else if (lv < 30)
        return ((Number)(lv * 15));
    else if (lv < 50)
        return Math.round((Number)(lv * lv / 1.5));
    else if (lv < 70)
        return Math.round((Number)(lv * lv / 1.2));
    else if (lv < 95)
        return ((Number)(lv * lv));
    else if (lv < 100)
        return Math.round((Number)(lv * lv * 1.1));
    else
        return 15000;
}

function attack(a, v) {
    var aIdx = user.indexOf(Player.getName(a));
    var vIdx = user.indexOf(Player.getName(v));

    if (stat[aIdx].bonusExp > gameTime) {
        var damage = 0;
        var random = Math.floor(Math.random() * 100);

        if (random < stat[aIdx].cri) {
            tellraw(user[aIdx], "§e치명타!");
            damage = Math.round(stat[aIdx].atk * (stat[aIdx].crid / 100));
        }
        else damage = stat[aIdx].atk;

        stat[vIdx].hp -= damage;

        tellraw(user[aIdx], user[vIdx] + "에게 " + damage + "만큼의 데미지를 줬다");
        tellraw(user[aIdx], user[vIdx] + "의 현재 체력 : " + stat[vIdx].hp);
        tellraw(user[vIdx], "§4체력 : " + stat[vIdx].hp + "§f");

        if (stat[vIdx].ability == 7) {
            stat[aIdx].hp -= (damage * 8 / 100).toFixed(0);

            tellraw(user[vIdx], user[aIdx] + "에게 " + damage + "만큼의 반사 데미지를 줬다");
            tellraw(user[vIdx], user[aIdx] + "의 현재 체력 : " + stat[aIdx].hp);
            tellraw(user[aIdx], user[vIdx] + "에게 " + damage + "만큼의 반사 데미지를 받았다");
            tellraw(user[aIdx], "§4체력 : " + stat[aIdx].hp + "§f");

            if (stat[aIdx].hp <= 0) kill(vIdx, aIdx);
        }

        if (stat[vIdx].hp <= 0) kill(aIdx, vIdx);
    }
    else {
        var bonus_exp = Math.round(nexp(stat[aIdx].lv) * 0.25);

        stat[aIdx].exp += bonus_exp;
        stat[aIdx].bonusExp = gameTime + 180;
        
        tellraw(user[aIdx], "보너스 경험치 획득 성공!");
        tellraw(user[aIdx], "경험치 요구량의 25٪ 에 해당하는 " + bonus_exp + " 만큼의 경험치를 획득했습니다");
    }
}

function skillHit(a, v, coe) {
    var aIdx = user.indexOf(Player.getName(a));
    var vIdx = user.indexOf(Player.getName(v));

    var damage = 0;
    var random = Math.floor(Math.random() * 100);

    if (random < stat[aIdx].cri) {
        tellraw(user[aIdx], "§e치명타!");
        damage = Math.round((stat[aIdx].atk * ((Number)(coe))) * (stat[aIdx].crid / 100));
    }
    else damage = ((Number)(coe)) * stat[aIdx].atk;

    stat[vIdx].hp -= damage;

    tellraw(user[aIdx], user[vIdx] + "에게 " + damage + "만큼의 스킬 데미지를 줬다");
    tellraw(user[aIdx], user[vIdx] + "의 현재 체력 : " + stat[vIdx].hp);
    tellraw(user[vIdx], "§4체력 : " + stat[vIdx].hp + "§f");

    if (stat[vIdx].ability == 7) {
        stat[aIdx].hp -= (damage * 8 / 100).toFixed(0);

        tellraw(user[vIdx], user[aIdx] + "에게 " + damage + "만큼의 반사 데미지를 줬다");
        tellraw(user[vIdx], user[aIdx] + "의 현재 체력 : " + stat[aIdx].hp);
        tellraw(user[aIdx], user[vIdx] + "에게 " + damage + "만큼의 반사 데미지를 받았다");
        tellraw(user[aIdx], "§4체력 : " + stat[aIdx].hp + "§f");

        if (stat[aIdx].hp <= 0) kill(vIdx, aIdx);
        else knockBack(a);
    }

    if (stat[vIdx].hp <= 0) kill(aIdx, vIdx);
    else knockBack(v);
}

function tellraw(target, text) {
    Level.executeCommand("/tellraw " + target + " {\"rawtext\":[{\"text\":\"" + text + "§f\"}]}");
}

function rangeTellraw(target, text, r) {
    Level.executeCommand("/execute " + target + " ~ ~ ~ tellraw @a[r=" + r + "] {\"rawtext\":[{\"text\":\"" + text + "§f\"}]}");
}

function inRange(e1, e2, r) {
    var xDis = ((Number)(Entity.getX(e1))) - ((Number)(Entity.getX(e2)));
    var yDis = ((Number)(Entity.getY(e1))) - ((Number)(Entity.getY(e2)));
    var zDis = ((Number)(Entity.getZ(e1))) - ((Number)(Entity.getZ(e2)));

    if (Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2) + Math.pow(zDis, 2)) <= r)
        return true;
    else
        return false;
}

function inRange_(x, y, z, e2, r) {
    var xDis = x - ((Number)(Entity.getX(e2)));
    var yDis = y - ((Number)(Entity.getY(e2)));
    var zDis = z - ((Number)(Entity.getZ(e2)));

    if (Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2) + Math.pow(zDis, 2)) <= r)
        return true;
    else
        return false;
}

function inLocationRange(e, x, y, z) {
    var xDis = x - ((Number)(Entity.getX(e2)));
    var yDis = y - ((Number)(Entity.getY(e2)));
    var zDis = z - ((Number)(Entity.getZ(e2)));

    if (Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2) + Math.pow(zDis, 2)) <= r)
        return true;
    else
        return false;
}

function knockBack(e) {
    Level.executeCommand("/summon snowball " + Entity.getX(e) + " " + Entity.getY(e) + " " + Entity.getZ(e));
}

function rateTp(playerEnt, targetEnt, targetName, distance) {
    var location = getRangeLocation(playerEnt, targetEnt, targetName, distance);
    
    Level.executeCommand("/tp " + Player.getName(playerEnt) + " " + location[0] + " " + (((Number)(Entity.getY(playerEnt))) + ((Number)(0.5))) + " " + location[1]);
}

function getRangeLocation(playerEnt, targetEnt, targetName, distance){
    var pX = Entity.getX(playerEnt);
    var pZ = Entity.getZ(playerEnt);

    Level.executeCommand("/execute " + Player.getName(playerEnt) + " ~ ~ ~ tp @e[type=" + targetName + "] ^ ^ ^1")

    var tX = Entity.getX(targetEnt);
    var tZ = Entity.getZ(targetEnt);

    Level.executeCommand("/tp @e[type=" + targetName + "] 0 -10 0");

    var xAbs = Math.abs(tX - pX);
    var zAbs = Math.abs(tZ - pZ);
    var xRate = (distance / (xAbs + zAbs)) * (tX - pX);
    var zRate = (distance / (xAbs + zAbs)) * (tZ - pZ);

    return [(pX + xRate), (pZ + zRate)];
}

function particle(particleType, x, y, z){
    Level.executeCommand("/particle minecraft:" + particleType + " " + x + " " + y + " " + z);
}

function executeParticle(targetName, particleType, x, y, z){
    Level.executeCommand("/execute " + targetName, " ~ ~ ~ particle minecraft:" + particleType + " ~" + x + " ~" + y + " ~" + z);
}

function kill(aIdx, vIdx) {
    death(vIdx);

    if (stat[vIdx].lv < stat[aIdx].lv) {
        tellraw(user[aIdx], "나보다 레벨이 낮은 " + user[vIdx] + "를 죽여 5 경험치를 얻었다");
        stat[aIdx].exp += 5;
    }
    else if (stat[vIdx].lv == stat[aIdx].lv) {
        tellraw(user[aIdx], "나와 레벨이 같은 " + user[vIdx] + "를 죽여 10 경험치를 얻었다");
        stat[aIdx].exp += 10;
    }
    else {
        tellraw(user[aIdx], "나보다 레벨이 높은 " + user[vIdx] + "를 죽여 30 경험치를 얻었다");
        stat[aIdx].exp += 30;
    }

    stat[aIdx].kill++;
    tellraw(user[aIdx], "§4현재 킬 : " + stat[aIdx].kill);
    Level.executeCommand("/say " + user[aIdx] + "가 " + user[vIdx] + "를 죽였습니다!");

    if (stat[aIdx].kill == killGoal) gameEnd(aIdx);
}

function death(u) {
    Level.executeCommand("/execute " + user[u] + " ~ ~ ~ tp ~ ~2000 ~");

    stat[u].reviveTime = gameTime + 10;
    stat[u].exp -= Math.round(stat[u].exp * 0.2);
    if (stat[u].exp < 0)
        stat[u].exp = 0;

    stat[u].hp = stat[u].maxHp;
    stat[u].mana = stat[u].maxMana;
}

function revive(u) {
    var random = Math.floor(Math.random() * spawnPointCount);

    stat[u].hp = stat[u].maxHp;

    Level.executeCommand("/tp " + user[u] + " " + spawnPoint[random].x + " " + spawnPoint[random].y + " " + spawnPoint[random].z);

    Level.executeCommand("/execute " + user[u] + " ~ ~ ~ particle minecraft:totem_particle ~ ~3 ~");
    Level.executeCommand("playsound firework.launch " + user[u]);
    Level.executeCommand("/title " + user[u] + " title 부활했습니다!");
}

function deathMessage(u) {
    stat[u].hp = stat[u].maxHp;

    Level.executeCommand("/title " + user[u] + " title §0당신은 사망하였습니다...!§f");
    Level.executeCommand("/title " + user[u] + " subtitle 부활까지 " + (stat[u].reviveTime - gameTime) + "초 남았습니다");
}

function lvUp(u) {
    stat[u].exp = 0;
    stat[u].lv++;

    stat[u].maxHp += 15;
    stat[u].hp += 15;
    stat[u].maxMana += 2;
    stat[u].mana = stat[u].maxMana;
    stat[u].atk += Math.floor(Math.random() * 4) + 5;

    tellraw(user[u], "--------------------------------");
    tellraw(user[u], "레벨업! §e현재 레벨§f : " + stat[u].lv);
    tellraw(user[u], "공격력이 " + stat[u].atk + " 이(가) 되었습니다");
    tellraw(user[u], "--------------------------------");

    if (Math.floor(Math.random() * 2) == 1) {
        stat[u].cri = parseInt(stat[u].cri) + 1;
        tellraw(user[u], "치명타 확률이 " + stat[u].cri + "٪ 이(가) 되었습니다");
    }

    if (Math.floor(Math.random() * 2) == 1) {
        stat[u].crid = parseInt(stat[u].crid) + 5;
        tellraw(user[u], "치명타 데미지가 " + stat[u].crid + "٪ 이(가) 되었습니다");
    }

    Level.executeCommand("/title " + user[u] + " clear");
    Level.executeCommand("/title " + user[u] + " title §e레벨업!");
    Level.executeCommand("/title " + user[u] + " subtitle 현재 레벨 : " + stat[u].lv);

    if (stat[u].hp > stat[u].maxHp)
        stat[u].hp = stat[u].maxHp;

    Level.executeCommand("playsound firework.launch " + user[u]);
}

function bonusExpChance(u) {
    if (stat[u].bonusExp == gameTime) {
        tellraw(user[u], "이제 보너스 경험치 획득이 가능합니다");
        tellraw(user[u], "보너스 경험치를 획득하려면 30초 안에 상대를 공격하세요!");
    }
    else if (stat[u].bonusExp + 30 == gameTime) {
        stat[u].bonusExp = gameTime + 180;
        tellraw(user[u], "30초가 지나 보너스 경험치 획득에 실패하였습니다...");
        tellraw(user[u], "3분 뒤 다시 기회를 노려보세요!");
    }
}

function killRank() {
    var max = 0;
    var maxName = new Array();

    for (var u in user) {
        if (max < stat[u].kill){
            maxName = new Array();
            max = stat[u].kill;
        }
        else if(max == stat[u].kill) maxName.push(user[u]);
    }

    Level.executeCommand("/say --------------------------------");
    
    if(max != 0) {
        Level.executeCommand("/say 현재 킬 1위");
        for(var n in maxName) Level.executeCommand("/say " + maxName[n] + " - " + max + "킬");
    }
    else Level.executeCommand("/say 현재 킬을 한 유저가 없습니다");

    Level.executeCommand("/say --------------------------------");
}

function abilityRoulette() {
    var abilityLog = new Array();
    
    Level.executeCommand("/say 능력 추첨을 시작합니다");

    for (var i = 0; i < user.length; i++) {
        while (true) {
            stat[i].ab = Math.floor(Math.random() * abilityCount) + 1;
            
            if (abilityLog.indexOf(stat[i].ab) != -1) continue;       //능력 중복을 막는 알고리즘

            abilityLog.push(stat[i].ab);
            abilitySetting(i, stat[i].ab);

            break;
        }
    }
    
    Level.executeCommand("능력 추첨이 완료되었습니다");
    
    return;
}

function abilitySetting(u, ability) {
    var name = user[u];
    var abilityName = "";
    var abilityExplanation = "";
    var maxCooltimeSet = 0;
    var itemDamage = 0;

    switch (ability) {
        case 1:
            itemDamage = 10;
            maxCooltimeSet = 10;
            abilityName = "§e점멸§f(10초)";
            abilityExplanation = "전방으로 순간이동하며 이동 전의 위치 주변 적에겐 공격력의 0.8배의 데미지를, 이동 후의 위치 주변 적에게 공격력의 1.2배에 해당하는 데미지를 준다";
            break;
        case 2:
            itemDamage = 11;
            maxCooltimeSet = 5;
            abilityName = "§4파이어볼§f(5초)";
            abilityExplanation = "전방으로 투사체를 날려 맞은 적에게 공격력의 1배에 해당하는 데미지를 주고 일정시간 불태운다";
            break;
        case 3:
            itemDamage = 12;
            maxCooltimeSet = 50;
            abilityName = "§c자기장§f(50초)";
            abilityExplanation = "전방을 자기장 지역으로 설정하고 잠시 후 자기장 지역의 모든 적을 띄우고 도트데미지를 준다";
            break;
        case 4:
            itemDamage = 13;
            maxCooltimeSet = 30;
            abilityName = "§0암살§f(30초)";
            abilityExplanation = "일정시간 투명화 버프를 받고 투명화 상태에서 공격 시 1.5배에 해당하는 데미지를 주고 투명화 버프가 풀린다";
            break;
        case 5:
            maxCooltimeSet = 45;
            abilityName = "§7버티기§f(P - 45초)";
            abilityExplanation = "체력이 최대 체력의 50% 이하로 내려갈 시 최대 체력의 35%를 회복한다";
            break;
        case 6:
            maxCooltimeSet = 0;
            abilityName = "§2회복§f(P)";
            abilityExplanation = "5초마다 1의 체력 대신 최대 체력의 6%를 회복한다";
            break;
        case 7:
            maxCooltimeSet = 0;
            abilityName = "§8방어§f(P)";
            abilityExplanation = "피격 시 데미지의 8%를 적에게 반사한다";
            break;
        case 8:
            itemDamage = 14;
            maxCooltimeSet = 45;
            abilityName = "§5속임수§f(45초)";
            abilityExplanation = "가장 가까운 적의 스킬 쿨타임을 최대 쿨타임으로 설정하고 잃은 체력의 50%에 해당하는 데미지를 준다. 단 적의 능력이 패시브일 경우 자신이 최대 체력의 25%에 해당하는 데미지를 받는다";
            break;
        case 9:
            itemDamage = 15;
            maxCooltimeSet = 20;
            abilityName = "§9중력 강화§f(20초)";
            abilityExplanation = "5초간 주변의 적들에게 구속 버프를 건다";
            break;
        case 10:
            itemDamage = 16;
            maxCooltimeSet = 60;
            abilityName = "§5도박사§f(60초)";
            abilityExplanation = "가장 가까운 플레이어와 함께 격리된 후, 랜덤으로 한명이 죽는다";
            break;
        case 11:
            itemDamage = 17;
            maxCooltimeSet = 50;
            abilityName = "§41대1§f(50초)";
            abilityExplanation = "가장 가까운 한명을 제외하고 모두 30칸 밖으로 순간이동시킨 뒤, 가장 가까운 플레이어에게 구속 버프를 건다";
    }
    
    stat[u].maxCool = ((Number)(maxCooltimeSet)) * 20;

    tellraw(name, "능력 : " + abilityName);
    tellraw(name, "설명 : " + abilityExplanation);
    Level.executeCommand("/give " + name + " spawn_egg 1 " + itemDamage);
}

function gameEnd(aIdx) {
    gameStart = false;
    gameTime = 0;
    tickCount = 0;

    Level.executeCommand("/say --------------------------------");
    Level.executeCommand("/say ★★★" + user[aIdx] + " 이(가) 목표 킬수인 " + killGoal + "킬을 달성했습니다!!!★★★");
    Level.executeCommand("/say 게임 종료 - 승리자 : " + user[aIdx]);
    Level.executeCommand("/say --------------------------------");

    for (var u in user) Level.executeCommand("/effect " + user[u] + " resistance 0");

    user = new Array();
}

function mkUser() {
    this.lv = ((Number)(1));
    this.exp = ((Number)(0));
    this.maxHp = ((Number)(100));
    this.hp = ((Number)(100));
    this.maxMana = ((Number)(100));
    this.mana = ((Number)(100));
    this.atk = ((Number)(5));
    this.cri = ((Number)(0));
    this.crid = ((Number)(100));
    this.reviveTime = ((Number)(-1));
    this.kill = ((Number)(0));
    this.bonusExp = ((Number)(180));
    this.ab = ((Number)(0));
    this.cool = ((Number)(0));
    this.maxCool = ((Number)(0));
}

function mkSpawnPoint(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}