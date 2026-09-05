import PageHeading from '@/components/page-heading';
export const metadata = { title: 'Open positions', alternates: { canonical: '/join/' } };
export default function Join() {
  return <><PageHeading title="Open positions" /><div className="prose">
    <p>We have a <a href="https://docs.google.com/document/d/1h44Gz1wOMx6QhHUWv9QFB3Jnrn-JzEMPHC0WZhPMEqU/edit#">postdoc position</a> available.</p>
    <p>We are also looking for PhD students, especially in but not limited to deep learning, causal inference, data science and mobile health. If you're interested please apply to the UW Allen School. Go Dawgs!</p>
  </div></>;
}
