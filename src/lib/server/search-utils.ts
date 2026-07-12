// Escapes ILIKE wildcards (% and _) and the escape character itself (\) so
// user input can't inject unintended wildcards; the tagged `sql` template
// still handles SQL-injection safety via parameterization.
export function escapeLikeWildcards(input: string): string {
    return input.replace(/[\\%_]/g, (char) => `\\${char}`)
}
