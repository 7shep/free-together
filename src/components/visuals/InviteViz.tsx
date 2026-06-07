import { palette as c } from '../../theme/colors';
import Avatar from '../ui/Avatar';
import AvatarStack from '../ui/AvatarStack';
import styles from './InviteViz.module.css';

/** Step 1 visual: a shareable invite link with friends joining. */
export default function InviteViz() {
  return (
    <div className={styles.invite}>
      <div className={styles.link}>
        <span className={styles.lk}>freetogether.app/</span>
        <strong>weekend-crew</strong>
      </div>
      <AvatarStack overlap={8}>
        <Avatar label="M" color={c.coral} size={30} />
        <Avatar label="T" color={c.violet} size={30} />
        <Avatar label="J" color={c.sky} size={30} />
        <Avatar label="+3" color={c.ink} size={30} />
      </AvatarStack>
    </div>
  );
}
