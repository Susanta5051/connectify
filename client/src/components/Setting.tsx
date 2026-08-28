import { ChevronDown, ChevronUp, Settings } from 'lucide-react'
import React, { useState } from 'react'

const Setting = () => {
    const [isOpen , setIsOpen] = useState(false)
  return (
    <div className="">
        {isOpen ?<div>
          <Settings size={29}/>
        </div>
        :
        <div>
            
        </div>
        }
      </div>
  )
}

export default Setting
