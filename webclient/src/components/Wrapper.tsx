import { Box } from "@chakra-ui/react"

interface WrapperProps {
  variant?: "small" | "regular"
}

export const Wrapper: React.FC<WrapperProps> = ({children, variant="regular"}) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={variant === "small" ? "400px" : "800px"}
      w="100%"
    >
      {children}
    </Box>
  )
}