export const onCell = (maxWidth:string) => ({
    style: {
        maxWidth: maxWidth,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
});