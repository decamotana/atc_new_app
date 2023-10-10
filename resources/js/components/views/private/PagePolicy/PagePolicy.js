import { Card, Typography } from "antd";

export default function PagePolicy() {
  return (
    <Card>
      <Typography.Title level={5}> WEB SITE PRIVACY POLICY </Typography.Title>
      <Typography.Paragraph>
        {" "}
        Your privacy is very important to us. Accordingly, we have developed
        this Policy in order for you to understand how we collect, use,
        communicate and disclose and make use of personal information. The
        following outlines our privacy policy.
      </Typography.Paragraph>

      <Typography.Paragraph>
        <ol type="1" style={{ marginLeft: "20px" }}>
          <li>
            Before or at the time of collecting personal information, we will
            identify the purposes for which information is being collected.
          </li>
          <li>
            We will collect and use this personal information solely with the
            objective of fulfilling those purposes specified by us and for other
            compatible purposes, unless we obtain the consent of the individual
            concerned or as required by law.
          </li>
          <li>
            We will only retain personal information as long as necessary for
            the fulfillment of those purposes.
          </li>
          <li>
            We will collect personal information by lawful and fair means and,
            where appropriate, with the knowledge or consent of the individual
            concerned.
          </li>
          <li>
            Personal data should be relevant to the purposes for which it is to
            be used, and, to the extent necessary for those purposes, should be
            accurate, complete, and up-to-date.
          </li>
          <li>
            We will protect personal information by reasonable security
            safeguards against loss or theft, as well as unauthorized access,
            disclosure, copying, use or modification.
          </li>
          <li>
            We will make readily available to customers information about our
            policies and practices relating to the management of personal
            information.
          </li>
        </ol>
      </Typography.Paragraph>
      <Typography.Paragraph>
        We are committed to conducting our business in accordance with these
        principles in order to ensure that the confidentiality of personal
        information is protected and maintained.
      </Typography.Paragraph>
    </Card>
  );
}
