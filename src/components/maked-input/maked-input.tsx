import { IMaskMixin } from 'react-imask'

import { Input } from '@/components/ui/input'

type IMaskedInputBase = React.ComponentProps<'input'> & {
  inputRef: React.Ref<HTMLInputElement>
}

export const MaskedInput = IMaskMixin(
  ({ inputRef, ...props }: IMaskedInputBase) => (
    <Input ref={inputRef} {...props} />
  ),
)
