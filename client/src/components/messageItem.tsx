export default function MessageItem(props: {
    author: string,
    text: string,
    own: boolean
}) {
    return (
        <div className={`message${props.own ? ' own' : ''}`}>
            <div className='author'>{props.author}</div>
            <div className='text'>{props.text}</div>
        </div>
    );
}