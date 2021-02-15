start = w:World ' ' c:Calls { return {world: w, ...c} } 
	/ c:Calls w:World { return {world: w, ...c} }
	
World = 'w' i:Integer { return i }
	/ i:Integer

Calls = c:Call next:(' ' Calls)? {
	next = next ? next[1] : []
	return {...c, ...next}
}

Call = (
	l:Location { return {location: l} }
	/ t:Tents { return {tents: t} }
	/ s:State { return {state: s} }
	/ t:Time { return {timer: t} }
	/ Pker { return {pker: true} }
	/ & World
	/ Garbage { return {} }
)
	

Location = ('DWF'i / 'ELM'i / 'RDI'i) { return text().toUpperCase() }

Tents = Tent Tent Tent

State = 'broken'i
	/ 'broke'i { return 'broken' }
	/ 'beamed'i { return 'fighting' }
	/ 'fighting'i
	/ 'boss'i { return 'fighting' }
	/ 'looting'i
	/ 'lootable'i { return 'looting' }
	/ 'loot'i { return 'looting' }    
	/ 'cleared'i { return 'looting' }
	/ 'clear'i { return 'looting' }
	/ 'dead'i
	/ 'empty'i

Tent = ('H'i / 'C'i / 'M'i / 'S'i / 'F'i) { return text().toUpperCase() }

Pker = 'pker'i / 'clanned'i / 'clan'i

Time = TimeMinute / TimeFull
TimeMinute = min:Integer _ ('min'i/'m'i) { return min * 60 }
TimeFull = min:Integer ':' sec:Integer { return min * 60 + sec; }

Garbage "garbage" = [^ ]+

Integer "integer" = [0-9]+ { return parseInt(text(), 10); }

_ "whitespace" = ' ' *
