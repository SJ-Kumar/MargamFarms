import { Box, Heading, Text, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box textAlign="center" py={20}>
      <Heading as="h1" size="2xl" mb={4}>
        404
      </Heading>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Page Not Found
      </Text>
      <Text fontSize="md" mb={8}>
        The page you are looking for does not exist or has been moved.
      </Text>
      <Link as={RouterLink} to="/" color="blue.500">
        Go back to the homepage
      </Link>
    </Box>
  );
};

export default NotFoundPage;
