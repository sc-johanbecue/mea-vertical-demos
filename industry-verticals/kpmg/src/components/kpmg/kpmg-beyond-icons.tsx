import type { JSX, SVGProps } from 'react';
import { kpmgBeyond } from './kpmg-beyond-tokens';

export type NavIconId =
  | 'home'
  | 'events'
  | 'communities'
  | 'insights'
  | 'solutions'
  | 'contact'
  | 'referral';

type IconProps = SVGProps<SVGSVGElement> & { active?: boolean };

const iconColor = (active?: boolean) => (active ? kpmgBeyond.accent : kpmgBeyond.white);

export function NavIcon({ id, active, ...props }: IconProps & { id: NavIconId }): JSX.Element {
  const color = iconColor(active);
  switch (id) {
    case 'home':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}>
          <path
            fill={color}
            fillRule="evenodd"
            d="M6.251 20a3.75 3.75 0 0 1-3.749-3.75v-5h-1.25c-1.113 0-1.67-1.346-.883-2.134L9.116.366a1.25 1.25 0 0 1 1.768 0l8.747 8.75c.788.788.23 2.134-.883 2.134h-1.25v5a3.75 3.75 0 0 1-3.75 3.75zM10 2.26 3.222 9.037c.653.506 1.256 1.427 1.256 2.316v5.524a1.38 1.38 0 0 0 1.38 1.381l2.38-.001v-4.142a1.38 1.38 0 0 1 1.381-1.381h.762a1.38 1.38 0 0 1 1.381 1.381v4.142l2.38.001a1.38 1.38 0 0 0 1.38-1.381v-5.524c0-.97.5-1.823 1.256-2.316z"
          />
        </svg>
      );
    case 'events':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}>
          <path
            fill={color}
            fillRule="evenodd"
            d="M15 0c.69 0 1.25.56 1.25 1.25V2.5A3.75 3.75 0 0 1 20 6.25v10A3.75 3.75 0 0 1 16.25 20H3.75A3.75 3.75 0 0 1 0 16.25v-10A3.75 3.75 0 0 1 3.75 2.5V1.25a1.25 1.25 0 0 1 2.5 0V2.5h7.5V1.25C13.75.56 14.31 0 15 0m2.5 10h-15v6.25c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25zM15 11.25c.69 0 1.25.56 1.25 1.25V15c0 .69-.56 1.25-1.25 1.25h-2.5c-.69 0-1.25-.56-1.25-1.25v-2.5c0-.69.56-1.25 1.25-1.25zM16.25 5H3.75c-.69 0-1.25.56-1.25 1.25V7.5h15V6.25c0-.69-.56-1.25-1.25-1.25"
          />
        </svg>
      );
    case 'communities':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={31} height={26} viewBox="0 0 31 26" {...props}>
          <g fill={color} fillRule="evenodd">
            <path d="M17.25 15.5h7.5A6.25 6.25 0 0 1 31 21.75a1.25 1.25 0 0 1-2.492.146l-.014-.366a3.75 3.75 0 0 0-3.524-3.524L24.75 18h-7.5c-2.071 0-3.5-.836-3.5 1.235 0 .69-1.141 1.015-1.832 1.015-.69 0-.862 1.117-.862-2.244 0-3.36 2.597-2.358 5.923-2.5zh7.5zM21 1a6.25 6.25 0 1 1 0 12.5A6.25 6.25 0 0 1 21 1m0 2.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5" />
            <path
              stroke={kpmgBeyond.bg}
              strokeWidth={2}
              d="M15.75 15.5c2.002 0 3.815.811 5.127 2.123A7.23 7.23 0 0 1 23 22.75c0 .621-.252 1.184-.659 1.591s-.97.659-1.591.659a2.245 2.245 0 0 1-2.235-1.988c-.052-.914-.344-1.638-.817-2.157a2.6 2.6 0 0 0-1.76-.849L8.25 20a2.744 2.744 0 0 0-2.75 2.75c0 .621-.252 1.184-.659 1.591S3.871 25 3.25 25s-1.184-.252-1.591-.659A2.24 2.24 0 0 1 1 22.75c0-1.945.766-3.711 2.013-5.013a7.23 7.23 0 0 1 4.945-2.231zM12 1c2.002 0 3.815.811 5.127 2.123S19.25 6.248 19.25 8.25s-.811 3.815-2.123 5.127S14.002 15.5 12 15.5s-3.815-.811-5.127-2.123S4.75 10.252 4.75 8.25s.811-3.815 2.123-5.127A7.23 7.23 0 0 1 12 1zm0 4.5a2.744 2.744 0 0 0-2.75 2.75A2.744 2.744 0 0 0 12 11a2.744 2.744 0 0 0 2.75-2.75A2.744 2.744 0 0 0 12 5.5z"
            />
          </g>
        </svg>
      );
    case 'insights':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 22 22" {...props}>
          <path
            fill={color}
            fillRule="evenodd"
            d="M11.125 18.5V9.06l4.179 10.434c.547 1.352 2.115 1.979 3.421 1.437l.77-.315c1.32-.504 2.001-2.129 1.442-3.42L15.043 2.483v-.001a2.63 2.63 0 0 0-3.422-1.44l-.77.316a2.5 2.5 0 0 0-.506.285A2.6 2.6 0 0 0 8.5.874H3.5A2.63 2.63 0 0 0 .875 3.5v15A2.63 2.63 0 0 0 3.5 21.125h5a2.63 2.63 0 0 0 2.625-2.625ZM13.15 3.202l6.063 14.924q.013.151-.038.296l-.016.037a.7.7 0 0 1-.386.382l-.77.315a.71.71 0 0 1-.921-.381L11.163 3.989a.71.71 0 0 1 .41-.856h.001l.77-.315h.001a.56.56 0 0 1 .474 0c.133.063.251.19.327.374zm-4.457-.384a.71.71 0 0 1 .515.682v15a.71.71 0 0 1-.708.708H6.958V2.794zM5.042 5.167v14.041H3.5a.71.71 0 0 1-.708-.707V3.5a.71.71 0 0 1 .708-.708h1.542z"
          />
        </svg>
      );
    case 'solutions':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}>
          <path
            fill={color}
            fillRule="evenodd"
            d="M16.25 11.25A3.75 3.75 0 0 1 20 15v1.25A3.75 3.75 0 0 1 16.25 20H3.75A3.75 3.75 0 0 1 0 16.25V15a3.75 3.75 0 0 1 3.75-3.75zm0 2.5H3.75c-.69 0-1.25.56-1.25 1.25v1.25c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V15c0-.69-.56-1.25-1.25-1.25Zm0-13.75A3.75 3.75 0 0 1 20 3.75V5a3.75 3.75 0 0 1-3.75 3.75H3.75A3.75 3.75 0 0 1 0 5V3.75A3.75 3.75 0 0 1 3.75 0zm0 2.5H3.75c-.69 0-1.25.56-1.25 1.25V5c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V3.75c0-.69-.56-1.25-1.25-1.25Z"
          />
        </svg>
      );
    case 'contact':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}>
          <path
            fill={color}
            fillRule="evenodd"
            d="m7.938 14.998-5.907 4.726c-.819.654-2.031.072-2.031-.976V3.75A3.75 3.75 0 0 1 3.75 0h12.5A3.75 3.75 0 0 1 20 3.75v7.498a3.75 3.75 0 0 1-3.75 3.75zM2.5 16.148l4.22-3.376c.22-.177.496-.274.78-.274h8.75c.69 0 1.25-.56 1.25-1.25V3.75c0-.69-.56-1.25-1.25-1.25H3.75c-.69 0-1.25.56-1.25 1.25v12.397z"
          />
        </svg>
      );
    case 'referral':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 116 115" fill="none" {...props}>
          <path
            fill={color}
            fillRule="evenodd"
            d="M58.041 26.108c-7.273-.006-13.14-5.835-13.137-13.059C44.908 5.862 50.821-.007 58.068 0S71.21 5.875 71.205 13.079c-.007 7.217-5.884 13.036-13.164 13.029"
          />
        </svg>
      );
    default:
      return <span />;
  }
}

export function IconMenu(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={26} height={19} fill="none" viewBox="0 0 26 19" {...props}>
      <path
        fill="#fff"
        d="M23.156 7.368H2.084a2.13 2.13 0 0 0-1.474.586A1.96 1.96 0 0 0 0 9.368c0 .53.22 1.04.61 1.414.391.376.921.586 1.474.586h21.072c.553 0 1.083-.21 1.474-.586.39-.375.61-.883.61-1.414s-.22-1.039-.61-1.414a2.13 2.13 0 0 0-1.474-.586M23.156 15H2.084C1.53 15 1 15.21.61 15.586A1.96 1.96 0 0 0 0 17c0 .53.22 1.04.61 1.414.391.375.921.586 1.474.586h21.072c.553 0 1.083-.21 1.474-.586.39-.375.61-.884.61-1.414s-.22-1.04-.61-1.414A2.13 2.13 0 0 0 23.156 15M23.156 0H2.084A2.13 2.13 0 0 0 .61.586 1.96 1.96 0 0 0 0 2c0 .53.22 1.04.61 1.414.391.375.921.586 1.474.586h21.072c.553 0 1.083-.21 1.474-.586.39-.375.61-.884.61-1.414S25.02.96 24.63.586A2.13 2.13 0 0 0 23.156 0"
      />
    </svg>
  );
}

export function IconClose(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <path stroke="#fff" strokeWidth={2} strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconSearch(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.75 0a8.75 8.75 0 0 1 7 14.001l.068.054.066.061 3.75 3.75a1.25 1.25 0 0 1-1.65 1.872l-.118-.104-3.75-3.75a1 1 0 0 1-.117-.135A8.75 8.75 0 1 1 8.75 0m0 2.5a6.25 6.25 0 1 0 0 12.5 6.25 6.25 0 0 0 0-12.5"
      />
    </svg>
  );
}

export function IconBell(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={21} height={23} viewBox="0 0 21 23" {...props}>
      <path
        fill="currentColor"
        fillRule="nonzero"
        d="M1.93 19.995c-1.14 0-1.82-1.27-1.188-2.22l.083-.125a15.1 15.1 0 0 0 2.533-8.367l.007-.302a6.43 6.43 0 0 1 5.704-6.085V1.428a1.429 1.429 0 0 1 2.857 0v1.468a6.43 6.43 0 0 1 5.713 6.387l.01.525c.097 2.794.97 5.51 2.524 7.84l.084.126a1.428 1.428 0 0 1-1.188 2.221h-5.714a2.857 2.857 0 0 1-5.713 0zm9.282-14.282H9.786a3.573 3.573 0 0 0-3.572 3.57c0 2.558-.547 5.075-1.59 7.385l-.223.47h12.196l-.223-.47a17.9 17.9 0 0 1-1.581-6.795l-.01-.59a3.57 3.57 0 0 0-3.57-3.57z"
      />
    </svg>
  );
}

export function IconUser(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={22} viewBox="0 0 20 22" {...props}>
      <path
        fill="#FFF"
        fillRule="evenodd"
        d="M6.25 14.5h7.5A6.25 6.25 0 0 1 20 20.75a1.25 1.25 0 0 1-2.492.146l-.014-.366a3.75 3.75 0 0 0-3.524-3.524L13.75 17h-7.5a3.75 3.75 0 0 0-3.75 3.75 1.25 1.25 0 0 1-2.5 0 6.25 6.25 0 0 1 5.979-6.244zh7.5zM10 0a6.25 6.25 0 1 1 0 12.5A6.25 6.25 0 0 1 10 0m0 2.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5"
      />
    </svg>
  );
}

export function IconChevronDown(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={19} height={11} viewBox="0 0 19 11" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M17.624 2.195 9.909 9.909a1.284 1.284 0 0 1-1.818 0L.377 2.195a1.284 1.284 0 0 1 0-1.818 1.284 1.284 0 0 1 1.818 0L9 7.182 15.806.377A1.284 1.284 0 0 1 18 1.286c0 .33-.126.658-.376.909"
      />
    </svg>
  );
}

export function IconPlay(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={71} height={71} viewBox="0 0 71 71" {...props}>
      <path
        fill="#FFF"
        fillRule="evenodd"
        d="M35.5 0C55.106 0 71 15.894 71 35.5S55.106 71 35.5 71 0 55.106 0 35.5 15.894 0 35.5 0M30 26.618a1 1 0 0 0-1 1v17.764a1 1 0 0 0 1.447.894l17.764-8.882a1 1 0 0 0 0-1.788l-17.764-8.882a1 1 0 0 0-.447-.106"
      />
    </svg>
  );
}

export function IconChevronLeft(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={13} height={20} viewBox="0 0 13 20" {...props}>
      <path
        fill="currentColor"
        fillRule="nonzero"
        d="m1.272 9.64 8.12-8.398c.185-.192.44-.302.712-.307a1 1 0 0 1 .723.283l.62.597c.402.39.414 1.033.024 1.435L4.654 10.3l7.067 6.816c.194.187.304.44.309.712s-.097.529-.284.723l-.598.617c-.187.195-.44.304-.712.309a1 1 0 0 1-.725-.284L1.3 11.08a1 1 0 0 1-.31-.715c-.005-.273.096-.53.283-.725z"
      />
    </svg>
  );
}

export function IconChevronRight(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={13} height={20} viewBox="0 0 13 20" {...props}>
      <path
        fill="currentColor"
        fillRule="nonzero"
        d="m11.637 9.64-8.12-8.398a1.01 1.01 0 0 0-.712-.307 1 1 0 0 0-.723.283l-.62.597a1.015 1.015 0 0 0-.024 1.435l6.818 7.05-7.067 6.816c-.195.187-.305.44-.31.712s.097.529.285.723l.597.617c.187.195.44.304.713.309s.53-.096.724-.284l8.412-8.114c.196-.189.306-.443.31-.715a1.01 1.01 0 0 0-.283-.725z"
      />
    </svg>
  );
}
