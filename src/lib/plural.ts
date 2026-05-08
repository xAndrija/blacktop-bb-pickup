export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}

// igra / igre / igara
export function pluralIgra(n: number) {
  return plural(n, 'igra', 'igre', 'igara')
}

// igrač / igrača / igrača
export function pluralIgrac(n: number) {
  return plural(n, 'igrač', 'igrača', 'igrača')
}

// slobodno mesto / slobodna mesta / slobodnih mesta
export function pluralMesto(n: number) {
  return plural(n, 'slobodno mesto', 'slobodna mesta', 'slobodnih mesta')
}
