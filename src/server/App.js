import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Loading from "../components/Loading";
import * as Yup from "yup";
import { ajax as doAjax } from "../util/ajax";
import "./styles.css";

window.pxq_pgck_settings =
  '{"pages":{"checker":"123","report":"142"},"gifts":{"welcome":"1","signup":20},"copyleaks":{"email":"a@a.com","apiKey":"a"},"wc":{"product":"158"}}';
window.pxq_pgck_pages =
  '{"38":"Cart","39":"Checkout","142":"dod-detail","40":"My account","141":"nitro","137":"nitro-apply","139":"nitro-detail","123":"pc","132":"pcr","37":"Shop"}';
window.pxq_pgck_products = '{"158":"credits","45":"Variable Product"}';

function parseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.error("pxq_pgck: exception when parsing JSON", e.message);
    return null;
  }
}
const pages = parseJSON(window.pxq_pgck_pages);
const products = parseJSON(window.pxq_pgck_products);
const settings = parseJSON(window.pxq_pgck_settings);

console.log(settings);
const validationSchema = Yup.object().shape({
  pages: Yup.object({
    checker: Yup.string().trim().required(),
    report: Yup.string().trim().required()
  }),
  gifts: Yup.object({
    welcome: Yup.number().integer().required().min(0),
    signup: Yup.number().integer().required().min(0)
  }),
  copyleaks: Yup.object({
    email: Yup.string().email().required(),
    apiKey: Yup.string().trim().required()
  }),
  wc: Yup.object({
    product: Yup.string().trim().required()
    //attribute: Yup.string().trim().required()
  })
});
function filterItems(items, name, state) {
  let obj = { ...items };
  if ("checker" === name && state.report) delete obj[state.report];
  else if ("report" === name && state.checker) delete obj[state.checker];
  return obj;
}
function buildOptions(items, name = null, state = {}) {
  const obj = name ? filterItems(items, name, state) : items;
  return [<option value="" key="default"></option>].concat(
    Object.keys(obj).map((id) => (
      <option key={id} value={id}>
        {obj[id]}
      </option>
    ))
  );
}
function InputField(props) {
  const { id, label, type = "text", hasError, help, options } = props;
  const classes = ["pxq_pgck_field"];
  if (hasError) classes.push("pxq_pgck_field--error");
  let field = null;
  if ("select" === type) {
    field = (
      <Field name={id} id={id} as="select" className="regular-text">
        {options}
      </Field>
    );
  } else
    field = <Field name={id} id={id} type={type} className="regular-text" />;
  return (
    <tr key={id} className={classes.join(" ")}>
      <th scope="row">
        <label htmlFor={id}>{label}</label>
      </th>
      <td>
        {field}
        <ErrorMessage name={id}>
          {(msg) => (
            <span className="pxq_pgck_error">{msg.replace(id, "")}</span>
          )}
        </ErrorMessage>
        <p className="help">{help}</p>
      </td>
    </tr>
  );
}
function Section(props) {
  return (
    <div className="pxq_pgck_section">
      <h3>{props.label}</h3>
      {props.children}
    </div>
  );
}

export default function App(props) {
  const [status, setStatus] = useState(0);
  if (!pages || !products || !settings) {
    return (
      <div id="pxq_pgck">
        <h1>Plagiarism checker settings</h1>
        <div style={{ marginTop: "40px" }}>
          <h3 className="pxq_pgck_error">
            Page load error - JSON parsing failed
          </h3>
          <p>Please try reloading the page!</p>
        </div>
      </div>
    );
  }
  return (
    <div id="pxq_pgck" className="wp-core-ui">
      <h1>Plagiarism checker settings</h1>
      <Formik
        initialValues={settings}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setStatus(1);
          setTimeout(() => {
            //alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
            resetForm({ values });
            setStatus(2);
          }, 1000);
          return;
          setStatus(1);
          doAjax(
            {
              type: "POST",
              data: {
                action: "pxq_pgck_save_settings",
                values
              }
            },
            (data) => {
              setStatus(2);
            },
            () => setStatus(3),
            () => {
              setSubmitting(false);
              resetForm({ values });
            }
          );
        }}
      >
        {({ isSubmitting, values, errors, isValid, dirty }) => (
          console.log(dirty, isValid),
          (
            <Form>
              <Section label="General" key="general">
                <table className="form-table" role="presentation">
                  <tbody>
                    <InputField
                      key="pages.checker"
                      id="pages.checker"
                      label="Plagiarism checker page"
                      hasError={errors.pages && errors.pages.checker}
                      type="select"
                      options={buildOptions(pages, "checker", values.pages)}
                      help="select a page which has [pxq_pgck_main] shortcode - this shortcode renders UI of plagiarism checker"
                    />
                    <InputField
                      key="pages.report"
                      id="pages.report"
                      label="Plagiarism report page"
                      hasError={errors.pages && errors.pages.report}
                      type="select"
                      options={buildOptions(pages, "report", values.pages)}
                      help="select a page which has [pxq_pgck_report] shortcode - this shortcode renders UI of web report"
                    />
                    <InputField
                      key="gifts.welcome"
                      id="gifts.welcome"
                      label="Welcome credit gift"
                      hasError={errors.gifts && errors.gifts.welcome}
                      type="number"
                      help="Enter a non-negative number to set how many credits to give to (guest or registered) user to try plagiarism checker"
                    />
                    <InputField
                      key="gifts.signup"
                      id="gifts.signup"
                      label="Signup credit gift"
                      hasError={errors.gifts && errors.gifts.signup}
                      type="number"
                      help="Enter a non-negative number to set how many credits to give to newly signed up user on 1st login"
                    />
                  </tbody>
                </table>
              </Section>
              <Section label="Copyleaks API credientials" key="copyleaks">
                <table className="form-table" role="presentation">
                  <tbody>
                    <InputField
                      key="copyleaks.email"
                      id="copyleaks.email"
                      label="Email"
                      hasError={errors.copyleaks && errors.copyleaks.email}
                    />
                    <InputField
                      key="copyleaks.apiKey"
                      id="copyleaks.apiKey"
                      label="API key"
                      hasError={errors.copyleaks && errors.copyleaks.apiKey}
                    />
                  </tbody>
                </table>
              </Section>
              <Section label="WooCommerce" key="wc">
                <table className="form-table" role="presentation">
                  <tbody>
                    <InputField
                      key="wc.product"
                      id="wc.product"
                      label="Product"
                      hasError={errors.wc && errors.wc.product}
                      type="select"
                      options={buildOptions(products)}
                      help={`Select a variable product to sell credits. This product must use a global attribute to create its variations. The slug of used attribute must be "credits" and the slugs of all terms of the attribute must be "numeric".`}
                    />
                    {1 ? null : (
                      <InputField
                        key="wc.attribute"
                        id="wc.attribute"
                        label="Attribute"
                        hasError={errors.wc && errors.wc.attribute}
                        type="select"
                        options={buildOptions(window.pxq_pgck_attributes)}
                        help="select an attritube. This attribute must be   This his attribute must be used in the above selected product to create variations an"
                      />
                    )}
                  </tbody>
                </table>
              </Section>
              <p className="submit">
                <button
                  disabled={
                    isSubmitting || (!dirty && 3 !== status) || !isValid
                  }
                  type="submit"
                  className="button button-primary"
                >
                  {isSubmitting ? "Saving" : "Save"}
                </button>
                {isSubmitting ? (
                  <Loading inline={true} message=" " />
                ) : (
                  <span className="pxq_pgck_error">
                    {!isValid ? " Validation failed" : ""}
                  </span>
                )}

                {!dirty && 2 === status ? (
                  <span className="pxq_pgck_success"> Successfuly saved</span>
                ) : null}
                {!dirty && 3 === status ? (
                  <span className="pxq_pgck_error">
                    {" "}
                    Failed. Please try again!
                  </span>
                ) : null}
              </p>
            </Form>
          )
        )}
      </Formik>
    </div>
  );
}
