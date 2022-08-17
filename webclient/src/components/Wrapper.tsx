import { Box } from "@chakra-ui/react"

export type WrapperVariant = "small" | "regular"

interface WrapperProps {
  variant?: WrapperVariant
  hasMT?: boolean
}

export const Wrapper: React.FC<WrapperProps> = ({children, variant="regular", hasMT=true}) => {
  return (
    <Box
      mt={hasMT ? 8 : 0}
      mx="auto"
      px={2}
      maxW={variant === "small" ? "400px" : "800px"}
      w="100%"
    >
      {children}
    </Box>
  )
}