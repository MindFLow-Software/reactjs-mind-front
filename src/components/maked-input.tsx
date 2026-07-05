import { Input } from './ui/input'
import { IMaskMixin } from 'react-imask'

interface MaskedInputBaseProps extends React.ComponentProps<'input'> {
  inputRef: React.Ref<HTMLInputElement>
}

export const MaskedInput = IMaskMixin(
  ({ inputRef, ...props }: MaskedInputBaseProps) => (
    <Input ref={inputRef} {...props} />
  ),
)
