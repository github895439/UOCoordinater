function changeTypoA(params) {
	let rtn = params.replace("&NBSP;", " ");
	rtn = rtn.replace("STRENTH REQUIREMENT", "STRENGTH REQUIREMENT");
	rtn = rtn.replace("DEFENCE", "DEFENSE");
	rtn = rtn.replace("SKILL REQUIRED", "WEAPON SKILL");
	rtn = rtn.replace("INTELLIGENCE + 10", "INTELLIGENCE BONUS +10");
	rtn = rtn.replace("DCI 5%", "DEFENSE CHANCE INCREASE 5%");
	rtn = rtn.replace("SDI 25%", "SPELL DAMAGE INCREASE 25%");
	rtn = rtn.replace("FCR 2", "FASTER CAST RECOVERY 2");
	rtn = rtn.replace("LMC", "LOWER MANA COST");
	rtn = rtn.replace("TWO HANDED WEAPON", "TWO-HANDED WEAPON");
	rtn = rtn.replace("ONE HANDED WEAPON", "ONE-HANDED WEAPON");
	rtn = rtn.replace("MANA REGEN 4", "MANA REGENERATION 4");
	rtn = rtn.replace("ENHANCED POTIONS", "ENHANCE POTIONS");
	rtn = rtn.replace("CHANNELLING", "CHANNELING");
	rtn = rtn.replace("SWORDSMANSHIP.", "SWORDSMANSHIP");
	rtn = rtn.replace("VARIABLE.", "VARIABLE");
	rtn = rtn.replace("STRENGTH REQUIRED 55", "STRENGTH REQUIREMENT 55");
	rtn = rtn.replace("HIT POINT REGEN,", "HIT POINT REGENERATION");
	rtn = rtn.replace("RESIST SPELLS", "RESISTING SPELLS");
	rtn = rtn.replace("HP INCREASE 10", "HIT POINT INCREASE 10");
	rtn = rtn.replace("SPELL DAMANGE INCREASE", "SPELL DAMAGE INCREASE");
	rtn = rtn.replace("ARCHERY DAMAGE MODIFIER", "DAMAGE MODIFIER");
	rtn = rtn.replace("WEAPONS SPEED", "WEAPON SPEED");
	rtn = rtn.replace("ALL DAMAGE EATER", "DAMAGE EATER");
	rtn = rtn.replace("DEXTERITY INCREASE", "DEXTERITY BONUS");
	rtn = rtn.replace("SEARING WEAPON", "SEARING");
	return rtn;
}
