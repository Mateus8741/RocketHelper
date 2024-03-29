import { Text, Button, IButtonProps, useTheme } from "native-base";

type Props = IButtonProps & {
  title: string;
  isActive?: boolean;
  type: "open" | "closed";
};

export function Filter({ title, isActive = false, type, ...rest }: Props) {
  const { colors } = useTheme();
  const colortType =
    type === "open" ? colors.secondary[700] : colors.green[300];
  return (
    <Button
      flex={1}
      variant="outline"
      borderWidth={isActive ? 1 : 0}
      borderColor={colortType}
      bgColor="gray.600"
      size="sm"
      {...rest}
    >
      <Text
        color={isActive ? colortType : "gray.300"}
        fontSize="xs"
        textTransform="uppercase"
      >
        {title}
      </Text>
    </Button>
  );
}
