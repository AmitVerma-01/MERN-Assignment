import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = "text",
    className = "",
    em=false,
    ...props
}, ref){
    const id = useId()
    return (
        <div className={`w-full ${em  && "flex items-center "}`} >
            {label && <label 
            className={`inline-block mb-1 pl-1 ${em && "pr-1"}`} 
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
            className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
            ref={ref}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input