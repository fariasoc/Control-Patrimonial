import { Button as ButtonNativeBase, IButtonProps, Heading, Fab, HStack, Box} from 'native-base';


type Props = IButtonProps & {
  title: string;
}

export function Button({ title, ...rest }: Props) {
  return (

    <ButtonNativeBase

      borderRadius="full"
      bg="pink.700"
      fontSize="sm"
      h={60} w={70}
      mt={0} mb={0}
      _pressed={{ bg: "gray.700" }}
      {...rest}
    >
   
      <Heading color="white" fontSize="xl">
        {title}
      </Heading>

    </ButtonNativeBase>

  );
}