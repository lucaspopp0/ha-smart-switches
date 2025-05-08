import React, { Children} from "react"

export type ListProps = {
    items: React.ReactNode[],
    containerStyle?: React.CSSProperties,
}

const List: React.FC<ListProps> = (props) => {
    const styles: Record<string, React.CSSProperties> = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            ...(props.containerStyle ?? {}),
        }
    }


    return (
        <div style={styles.container}>
            {props.items.map(item => item)}
        </div>
    )
}

export default List;
