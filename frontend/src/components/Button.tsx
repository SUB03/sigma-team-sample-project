interface Props {
    children: string
    color?: 'primary' | 'secondary' | 'danger'
    onClick: () => void
    disabled?: boolean
}

const Button = ({ children, color = 'primary', onClick, disabled = false }: Props) => {
    return (
        <div 
            className={'btn btn-' + color + (disabled ? ' disabled' : '')} 
            onClick={disabled ? undefined : onClick}
            style={{ opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
            {children}
        </div>
    )
}

export default Button
