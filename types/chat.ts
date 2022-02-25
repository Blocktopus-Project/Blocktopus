type Hex =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f";

type EscapeCodes = Hex | "k" | "l" | "m" | "n" | "o" | "r";

type Color = `§${EscapeCodes}` | `#${Hex}${Hex}${Hex}`;

type Link = `http://${string}` | `https://${string}`;

interface OpenURL {
  action: "open_url";
  value: Link;
}

interface RunCommand {
  action: "run_command";
  value: string;
}

interface SuggestCommand {
  action: "suggest_command";
  value: string;
}

interface ChangePage {
  action: "change_page";
  value: number;
}

interface CopyToClipboard {
  action: "copy_to_clipboard";
  value: string;
}

type ClickEvent =
  | OpenURL
  | RunCommand
  | SuggestCommand
  | ChangePage
  | CopyToClipboard;

interface ShowText {
  action: "show_text";
  value: string | Chat;
}

interface ShowItem {
  action: "show_item";
  value: string | { text: string };
}
interface ShowEntity {
  action: "show_entity";
  value: string;
}

type HoverEvent = ShowText | ShowItem | ShowEntity;

export interface Chat {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underlined?: boolean;
  strikethrough?: boolean;
  obfuscated?: boolean;
  font?: "minecraft:uniform" | "minecraft:alt" | "minecraft:default";
  color?: Color | "reset";
  clickEvent?: ClickEvent;
  hoverEvent?: HoverEvent;
  extra?: Omit<Chat, "extra">[];
}
