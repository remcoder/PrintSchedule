export type Color = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' |'brown' | 'black' | 'white' | 'grey';

export const palette : { [Key in Color]: string } = {
	red: '#EB3030',
	orange: '#FCAD36',
	yellow: '#D0C668',
	green: '#6AC362',
	blue: '#6277C3',
	purple: '#BC74D5',
	brown: '#BF5C5C',
	black: '#42475C',
	white: '#FCFCFC',
	grey: '#959595'
};

export function lookupColor(color : Color) {
	return palette[color] ?? color;
}
