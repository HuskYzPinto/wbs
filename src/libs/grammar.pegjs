start = _ w:World _ c:Calls _ { return {world: w, ...c} }
	/ _ c:Calls _ w:World _ { return {world: w, ...c} }
	
World = 'w'i i:Integer { return i }
	/ i:Integer

Calls = c:Call next:([,. ]+ Calls)? {
	next = next ? next[1] : []
	return {...c, ...next}
}

Call = (
	l:Location { return {location: l} }
	/ Future _ .+ { return {} }
	/ s:State _ Future { return {} }
	/ s:State { return {state: s} }
	/ t:Time { return {timer: t} }
	/ Pker { return {pker: true} }
	/ t:Tents SpaceOrEnd { return {tents: t} }
	/ & World
	/ Garbage { return {} }
)
	

Location = ('DWF'i / 'ELM'i / 'RDI'i) { return text().toUpperCase() }


Tents = a:FullTent __ b:FullTent __ c:FullTent { return [a, b, c] }
	/ a:FullTent __ b:FullTent { return [a, b] }
	/ a:FullTent { return [a] }
	/ a:Tent __ b:Tent __ c:Tent { return [a, b, c] }
	/ a:Tent __ b:Tent { return [a, b] }
	/ a:Tent { return [a] }

State = 'broken'i
	/ 'broke'i { return 'broken' }
	/ 'ruined'i { return 'broken' }
	/ 'ruin'i { return 'broken' }
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
	/ 'emptied'i { return 'empty' }

Future = 'soon'i / 'prob'i / 'probs'i / 'will'i / 'gonna'i

Tent = ('H'i / 'C'i / 'M'i / 'S'i / 'F'i) { return text().toUpperCase() }
FullTent = (
	'herblore'i
	/ 'herb'i
	/ 'farming'i
	/ 'farm'i
	/ 'construction'i
	/ 'cons'i
	/ 'mining'i
	/ 'mine'i
	/ 'smithing'i
	/ 'smith'i
) { return text()[0].toUpperCase() }

Pker = 'pking'i / 'pker'i / 'clanned'i / 'clan'i / 'pk'i

Time = TimeMinute / TimeFull
TimeMinute = min:Integer _ ('min'i/'m'i) { return min * 60 }
TimeFull = min:Integer ':' sec:Integer { return min * 60 + sec; }

Garbage "garbage" = [^ ]+

Integer "integer" = [0-9]+ { return parseInt(text(), 10); }

SpaceOrEnd = & [ ,]+
	/ ! .

__ "tent-sep" = [ /]*
_ "whitespace" = ' ' *
