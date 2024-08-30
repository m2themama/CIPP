import React, { useState } from 'react'
import {
  CCol,
  CRow,
  CForm,
  CCallout,
  CSpinner,
  CFormInput,
  CFormLabel,
  CFormRange,
  CProgress,
} from '@coreui/react'
import { Field, FormSpy } from 'react-final-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { CippWizard } from 'src/components/layout'
import { CippTable, WizardTableField } from 'src/components/tables'
import { TitleButton } from 'src/components/buttons'
import PropTypes from 'prop-types'
import { useLazyGenericGetRequestQuery, useLazyGenericPostRequestQuery } from 'src/store/api/app'
import { cellGenericFormatter } from 'src/components/tables/CellGenericFormat'
import { Condition, RFFCFormSwitch } from 'src/components/forms'

const Error = ({ name }) => (
  <Field
    name={name}
    subscription={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? (
        <CCallout color="danger">
          <FontAwesomeIcon icon={faExclamationTriangle} color="danger" className="me-2" />
          {error}
        </CCallout>
      ) : null
    }
  />
)

Error.propTypes = {
  name: PropTypes.string.isRequired,
}

const requiredArray = (value) => {
  if (value && value.length !== 0) {
    /// group each item in value by roleDefinitionId and select Role name where count is greater than 1
    const duplicateRoles = value
      .map((item) => item.roleDefinitionId)
      .filter((item, index, self) => index !== self.indexOf(item))

    if (duplicateRoles.length > 0) {
      var duplicates = value.filter((item) => duplicateRoles.includes(item.roleDefinitionId))
      /// get unique list of duplicate roles

      duplicates = duplicates
        .filter(
          (role, index, self) =>
            index === self.findIndex((t) => t.roleDefinitionId === role.roleDefinitionId),
        )
        .map((role) => role.RoleName)
      return `Duplicate GDAP Roles selected, ensure there is only one group mapping for the listed roles to continue: ${duplicates.join(
        ', ',
      )}`
    } else {
      return undefined
    }
  } else {
    return 'You must select at least one GDAP Role'
  }
}

const GDAPInviteWizard = () => {
  const defaultRolesArray = [
  {
    Name: 'Application Administrator',
    ObjectId: '9b895d92-2cd3-44c7-9d02-a6ac2d5ea5c3',
  },
  {
    Name: 'Application Developer',
    ObjectId: 'cf1c38e5-3621-4004-a7cb-879624dced7c',
  },
  {
    Name: 'Attack Payload Author',
    ObjectId: '9c6df0f2-1e7c-4dc3-b195-66dfbd24aa8f',
  },
  {
    Name: 'Attack Simulation Administrator',
    ObjectId: 'c430b396-e693-46cc-96f3-db01bf8bb62a',
  },
  {
    Name: 'Attribute Assignment Administrator',
    ObjectId: '58a13ea3-c632-46ae-9ee0-9c0d43cd7f3d',
  },
  {
    Name: 'Attribute Assignment Reader',
    ObjectId: 'ffd52fa5-98dc-465c-991d-fc073eb59f8f',
  },
  {
    Name: 'Attribute Definition Administrator',
    ObjectId: '8424c6f0-a189-499e-bbd0-26c1753c96d4',
  },
  {
    Name: 'Attribute Definition Reader',
    ObjectId: '1d336d2c-4ae8-42ef-9711-b3604ce3fc2c',
  },
  {
    Name: 'Authentication Administrator',
    ObjectId: 'c4e39bd9-1100-46d3-8c65-fb160da0071f',
  },
  {
    Name: 'Authentication Policy Administrator',
    ObjectId: '0526716b-113d-4c15-b2c8-68e3c22b9f80',
  },
  {
    Name: 'Azure AD Joined Device Local Administrator',
    ObjectId: '9f06204d-73c1-4d4c-880a-6edb90606fd8',
  },
  {
    Name: 'Azure DevOps Administrator',
    ObjectId: 'e3973bdf-4987-49ae-837a-ba8e231c7286',
  },
  {
    Name: 'Azure Information Protection Administrator',
    ObjectId: '7495fdc4-34c4-4d15-a289-98788ce399fd',
  },
  {
    Name: 'B2C IEF Keyset Administrator',
    ObjectId: 'aaf43236-0c0d-4d5f-883a-6955382ac081',
  },
  {
    Name: 'B2C IEF Policy Administrator',
    ObjectId: '3edaf663-341e-4475-9f94-5c398ef6c070',
  },
  {
    Name: 'Billing Administrator',
    ObjectId: 'b0f54661-2d74-4c50-afa3-1ec803f12efe',
  },
  {
    Name: 'Cloud App Security Administrator',
    ObjectId: '892c5842-a9a6-463a-8041-72aa08ca3cf6',
  },
  {
    Name: 'Cloud Application Administrator',
    ObjectId: '158c047a-c907-4556-b7ef-446551a6b5f7',
  },
  {
    Name: 'Cloud Device Administrator',
    ObjectId: '7698a772-787b-4ac8-901f-60d6b08affd2',
  },
  {
    Name: 'Company Administrator',
    ObjectId: '62e90394-69f5-4237-9190-012177145e10',
  },
  {
    Name: 'Compliance Administrator',
    ObjectId: '17315797-102d-40b4-93e0-432062caca18',
  },
  {
    Name: 'Compliance Data Administrator',
    ObjectId: 'e6d1a23a-da11-4be4-9570-befc86d067a7',
  },
  {
    Name: 'Conditional Access Administrator',
    ObjectId: 'b1be1c3e-b65d-4f19-8427-f6fa0d97feb9',
  },
  {
    Name: 'Customer LockBox Access Approver',
    ObjectId: '5c4f9dcd-47dc-4cf7-8c9a-9e4207cbfc91',
  },
  {
    Name: 'Desktop Analytics Administrator',
    ObjectId: '38a96431-2bdf-4b4c-8b6e-5d3d8abac1a4',
  },
  {
    Name: 'Device Join',
    ObjectId: '9c094953-4995-41c8-84c8-3ebb9b32c93f',
  },
  {
    Name: 'Device Users',
    ObjectId: 'd405c6df-0af8-4e3b-95e4-4d06e542189e',
  },
  {
    Name: 'Directory Readers',
    ObjectId: '88d8e3e3-8f55-4a1e-953a-9b9898b8876b',
  },
  {
    Name: 'Directory Synchronization Accounts',
    ObjectId: 'd29b2b05-8046-44ba-8758-1e26182fcf32',
  },
  {
    Name: 'Directory Writers',
    ObjectId: '9360feb5-f418-4baa-8175-e2a00bac4301',
  },
  {
    Name: 'Domain Name Administrator',
    ObjectId: '8329153b-31d0-4727-b945-745eb3bc5f31',
  },
  {
    Name: 'Dynamics 365 Administrator',
    ObjectId: '44367163-eba1-44c3-98af-f5787879f96a',
  },
  {
    Name: 'Edge Administrator',
    ObjectId: '3f1acade-1e04-4fbc-9b69-f0302cd84aef',
  },
  {
    Name: 'Exchange Administrator',
    ObjectId: '29232cdf-9323-42fd-ade2-1d097af3e4de',
  },
  {
    Name: 'Exchange Recipient Administrator',
    ObjectId: '31392ffb-586c-42d1-9346-e59415a2cc4e',
  },
  {
    Name: 'External ID User Flow Administrator',
    ObjectId: '6e591065-9bad-43ed-90f3-e9424366d2f0',
  },
  {
    Name: 'External ID User Flow Attribute Administrator',
    ObjectId: '0f971eea-41eb-4569-a71e-57bb8a3eff1e',
  },
  {
    Name: 'External Identity Provider Administrator',
    ObjectId: 'be2f45a1-457d-42af-a067-6ec1fa63bc45',
  },
  {
    Name: 'Global Reader',
    ObjectId: 'f2ef992c-3afb-46b9-b7cf-a126ee74c451',
  },
  {
    Name: 'Groups Administrator',
    ObjectId: 'fdd7a751-b60b-444a-984c-02652fe8fa1c',
  },
  {
    Name: 'Guest Inviter',
    ObjectId: '95e79109-95c0-4d8e-aee3-d01accf2d47b',
  },
  {
    Name: 'Helpdesk Administrator',
    ObjectId: '729827e3-9c14-49f7-bb1b-9608f156bbb8',
  },
  {
    Name: 'Hybrid Identity Administrator',
    ObjectId: '8ac3fc64-6eca-42ea-9e69-59f4c7b60eb2',
  },
  {
    Name: 'Identity Governance Administrator',
    ObjectId: '45d8d3c5-c802-45c6-b32a-1d70b5e1e86e',
  },
  {
    Name: 'Insights Administrator',
    ObjectId: 'eb1f4a8d-243a-41f0-9fbd-c7cdf6c5ef7c',
  },
  {
    Name: 'Insights Analyst',
    ObjectId: '25df335f-86eb-4119-b717-0ff02de207e9',
  },
  {
    Name: 'Insights Business Leader',
    ObjectId: '31e939ad-9672-4796-9c2e-873181342d2d',
  },
  {
    Name: 'Intune Administrator',
    ObjectId: '3a2c62db-5318-420d-8d74-23affee5d9d5',
  },
  {
    Name: 'Kaizala Administrator',
    ObjectId: '74ef975b-6605-40af-a5d2-b9539d836353',
  },
  {
    Name: 'Knowledge Administrator',
    ObjectId: 'b5a8dcf3-09d5-43a9-a639-8e29ef291470',
  },
  {
    Name: 'Knowledge Manager',
    ObjectId: '744ec460-397e-42ad-a462-8b3f9747a02c',
  },
  {
    Name: 'License Administrator',
    ObjectId: '4d6ac14f-3453-41d0-bef9-a3e0c569773a',
  },
  {
    Name: 'Lifecycle Workflows Administrator',
    ObjectId: '59d46f88-662b-457b-bceb-5c3809e5908f',
  },
  {
    Name: 'Message Center Privacy Reader',
    ObjectId: 'ac16e43d-7b2d-40e0-ac05-243ff356ab5b',
  },
  {
    Name: 'Message Center Reader',
    ObjectId: '790c1fb9-7f7d-4f88-86a1-ef1f95c05c1b',
  },
  {
    Name: 'Network Administrator',
    ObjectId: 'd37c8bed-0711-4417-ba38-b4abe66ce4c2',
  },
  {
    Name: 'Office Apps Administrator',
    ObjectId: '2b745bdf-0803-4d80-aa65-822c4493daac',
  },
  {
    Name: 'Partner Tier1 Support',
    ObjectId: '4ba39ca4-527c-499a-b93d-d9b492c50246',
  },
  {
    Name: 'Partner Tier2 Support',
    ObjectId: 'e00e864a-17c5-4a4b-9c06-f5b95a8d5bd8',
  },
  {
    Name: 'Password Administrator',
    ObjectId: '966707d0-3269-4727-9be2-8c3a10f19b9d',
  },
  {
    Name: 'Permissions Management Administrator',
    ObjectId: 'af78dc32-cf4d-46f9-ba4e-4428526346b5',
  },
  {
    Name: 'Power BI Administrator',
    ObjectId: 'a9ea8996-122f-4c74-9520-8edcd192826c',
  },
  {
    Name: 'Power Platform Administrator',
    ObjectId: '11648597-926c-4cf3-9c36-bcebb0ba8dcc',
  },
  {
    Name: 'Printer Administrator',
    ObjectId: '644ef478-e28f-4e28-b9dc-3fdde9aa0b1f',
  },
  {
    Name: 'Printer Technician',
    ObjectId: 'e8cef6f1-e4bd-4ea8-bc07-4b8d950f4477',
  },
  {
    Name: 'Privileged Authentication Administrator',
    ObjectId: '7be44c8a-adaf-4e2a-84d6-ab2649e08a13',
  },
  {
    Name: 'Privileged Role Administrator',
    ObjectId: 'e8611ab8-c189-46e8-94e1-60213ab1f814',
  },
  {
    Name: 'Reports Reader',
    ObjectId: '4a5d8f65-41da-4de4-8968-e035b65339cf',
  },
  {
    Name: 'Search Administrator',
    ObjectId: '0964bb5e-9bdb-4d7b-ac29-58e794862a40',
  },
  {
    Name: 'Search Editor',
    ObjectId: '8835291a-918c-4fd7-a9ce-faa49f0cf7d9',
  },
  {
    Name: 'Security Administrator',
    ObjectId: '194ae4cb-b126-40b2-bd5b-6091b380977d',
  },
  {
    Name: 'Security Operator',
    ObjectId: '5f2222b1-57c3-48ba-8ad5-d4759f1fde6f',
  },
  {
    Name: 'Security Reader',
    ObjectId: '5d6b6bb7-de71-4623-b4af-96380a352509',
  },
  {
    Name: 'Service Support Administrator',
    ObjectId: 'f023fd81-a637-4b56-95fd-791ac0226033',
  },
  {
    Name: 'SharePoint Administrator',
    ObjectId: 'f28a1f50-f6e7-4571-818b-6a12f2af6b6c',
  },
  {
    Name: 'Skype for Business Administrator',
    ObjectId: '75941009-915a-4869-abe7-691bff18279e',
  },
  {
    Name: 'Teams Administrator',
    ObjectId: '69091246-20e8-4a56-aa4d-066075b2a7a8',
  },
  {
    Name: 'Teams Communications Administrator',
    ObjectId: 'baf37b3a-610e-45da-9e62-d9d1e5e8914b',
  },
  {
    Name: 'Teams Communications Support Engineer',
    ObjectId: 'f70938a0-fc10-4177-9e90-2178f8765737',
  },
  {
    Name: 'Teams Communications Support Specialist',
    ObjectId: 'fcf91098-03e3-41a9-b5ba-6f0ec8188a12',
  },
  {
    Name: 'Teams Devices Administrator',
    ObjectId: '3d762c5a-1b6c-493f-843e-55a3b42923d4',
  },
  {
    Name: 'Usage Summary Reports Reader',
    ObjectId: '75934031-6c7e-415a-99d7-48dbd49e875e',
  },
  {
    Name: 'User Administrator',
    ObjectId: 'fe930be7-5e62-47db-91af-98c3a49a38b1',
  },
  {
    Name: 'Virtual Visits Administrator',
    ObjectId: 'e300d9e7-4a2b-4295-9eff-f1c78b36cc98',
  },
  {
    Name: 'Viva Goals Administrator',
    ObjectId: '92b086b3-e367-4ef2-b869-1de128fb986e',
  },
  {
    Name: 'Viva Pulse Administrator',
    ObjectId: '87761b17-1ed2-4af3-9acd-92a150038160',
  },
  {
    Name: 'Windows 365 Administrator',
    ObjectId: '11451d60-acb2-45eb-a7d6-43d0f0125c13',
  },
  {
    Name: 'Windows Update Deployment Administrator',
    ObjectId: '32696413-001a-46ae-978c-ce0f6b3620d2',
  },
  {
    Name: 'Workplace Device Join',
    ObjectId: 'c34f683f-4d5a-4403-affd-6615e00e3a7f',
  },
  {
    Name: 'Yammer Administrator',
    ObjectId: '810a2642-a034-447f-a5e8-41beaa378541',
  },
  {
    Name: 'Organizational Branding Administrator',
    ObjectId: '92ed04bf-c94a-4b82-9729-b799a7a4c178',
  }
]
  const [inviteCount, setInviteCount] = useState(1)
  const [loopRunning, setLoopRunning] = React.useState(false)
  const [massResults, setMassResults] = React.useState([])
  const [genericPostRequest, postResults] = useLazyGenericPostRequestQuery()
  const [genericGetRequest, getResults] = useLazyGenericGetRequestQuery()
  const [easyModeDone, setEasyMode] = useState(false)
  const [easyModeProgress, setEasyModeProgress] = useState(null)

  const handleSubmit = async (values) => {
    if (values.easyMode === true) {
      if (easyModeDone === false) {
        const defaultRoles = {
          gdapRoles: defaultRolesArray,
        }
        const easyModeValues = { ...defaultRoles }
        try {
          await genericPostRequest({ path: '/api/ExecAddGDAPRole', values: easyModeValues })
          const results = await genericGetRequest({ path: '/api/ListGDAPRoles' })
          const filteredResults = results.data.filter((role) =>
            defaultRolesArray.some((defaultRole) => defaultRole.ObjectId === role.roleDefinitionId),
          )
          const uniqueFilteredResults = filteredResults.filter(
            (role, index, self) =>
              index === self.findIndex((t) => t.roleDefinitionId === role.roleDefinitionId),
          )
          filteredResults.length = 0
          Array.prototype.push.apply(filteredResults, uniqueFilteredResults)
          setEasyMode(true)
          const resultsarr = []
          setLoopRunning(true)
          for (var x = 0; x < inviteCount; x++) {
            const results = await genericPostRequest({
              path: '/api/ExecGDAPInvite',
              values: { ...values, gdapRoles: filteredResults },
            })
            resultsarr.push(results.data)
            setMassResults(resultsarr)
          }
          setLoopRunning(false)
        } catch (error) {
          setEasyModeProgress(`Failed to create GDAP roles or invite users ${error}`)
          setLoopRunning(false)
        }
      }
    } else {
      // Normal mode execution
      const resultsarr = []
      setLoopRunning(true)
      for (var y = 0; y < inviteCount; y++) {
        const results = await genericPostRequest({ path: '/api/ExecGDAPInvite', values: values })
        resultsarr.push(results.data)
        setMassResults(resultsarr)
      }
      setLoopRunning(false)
    }
  }

  const formValues = { easyMode: true }

  const inviteColumns = [
    {
      name: 'Id',
      selector: (row) => row?.Invite?.RowKey,
      exportSelector: 'Invite/RowKey',
      sortable: true,
      omit: true,
      cell: cellGenericFormatter(),
    },
    {
      name: 'Invite Link',
      sortable: true,
      selector: (row) => row?.Invite?.InviteUrl,
      exportSelector: 'Invite/InviteUrl',
      cell: cellGenericFormatter(),
    },
    {
      name: 'Onboarding Link',
      sortable: true,
      selector: (row) => row?.Invite?.OnboardingUrl,
      exportSelector: 'Invite/OnboardingUrl',
      cell: cellGenericFormatter(),
    },
    {
      name: 'Message',
      sortable: true,
      selector: (row) => row?.Message,
      exportSelector: 'Message',
      cell: cellGenericFormatter(),
    },
  ]

  return (
    <CippWizard
      initialValues={{ ...formValues }}
      onSubmit={handleSubmit}
      wizardTitle="GDAP Invite Wizard"
    >
      <CippWizard.Page title="Roles" description="Choose from the mapped GDAP Roles">
        <center>
          <h3 className="text-primary">Step 1</h3>
          <h5 className="card-title mb-4">
            Select which roles you want to add to GDAP relationship.
          </h5>
        </center>
        <hr className="my-4" />
        <CForm onSubmit={handleSubmit}>
          <RFFCFormSwitch name="easyMode" label="Use CIPP recommended roles and settings" />
          <Condition when="easyMode" is={true}>
            <CCallout color="info">
              <p>
                CIPP will create 12 new groups in your Azure AD environment if they do not exist,
                and add the CIPP user to these 12 groups. The CIPP user will be added to the
                following groups:
              </p>
              <ul>
                <li>M365 GDAP Application Administrator</li>
                <li>M365 GDAP Authentication Policy Administrator</li>
                <li>M365 GDAP Cloud App Security Administrator</li>
                <li>M365 GDAP Cloud Device Administrator</li>
                <li>M365 GDAP Exchange Administrator</li>
                <li>M365 GDAP Intune Administrator</li>
                <li>M365 GDAP Privileged Authentication Administrator</li>
                <li>M365 GDAP Privileged Role Administrator</li>
                <li>M365 GDAP Security Administrator</li>
                <li>M365 GDAP SharePoint Administrator</li>
                <li>M365 GDAP Teams Administrator</li>
                <li>M365 GDAP User Administrator</li>
              </ul>
              Any other user that needs to gain access to your Microsoft CSP Tenants will need to be
              manually added to these groups.
            </CCallout>
          </Condition>
          <Condition when="easyMode" is={false}>
            <CCallout color="info">
              CIPP will create a single relationship with all roles you've selected for the maximum
              duration of 730 days using a GUID as a random name for the relationship.
            </CCallout>

            <div className="mb-2">
              <TitleButton href="/tenant/administration/gdap-role-wizard" title="Map GDAP Roles" />
            </div>

            <Field name="gdapRoles" validate={requiredArray}>
              {(props) => (
                <WizardTableField
                  reportName="gdaproles"
                  keyField="defaultDomainName"
                  path="/api/ListGDAPRoles"
                  columns={[
                    {
                      name: 'Name',
                      selector: (row) => row['RoleName'],
                      sortable: true,
                      exportselector: 'Name',
                    },
                    {
                      name: 'Group',
                      selector: (row) => row['GroupName'],
                      sortable: true,
                    },
                  ]}
                  fieldProps={props}
                />
              )}
            </Field>
          </Condition>
          <Error name="gdapRoles" />
        </CForm>
        <hr className="my-4" />
      </CippWizard.Page>
      <CippWizard.Page title="Invite Options" description="Select options for the invite">
        <center>
          <h3 className="text-primary">Step 2</h3>
          <h5 className="card-title mb-4">Invite Options</h5>
        </center>
        <hr className="my-4" />
        <CFormLabel>Number of Invites</CFormLabel>
        <CRow className="mb-3">
          <CCol md={1} xs={6}>
            <CFormInput
              id="invite-count"
              value={inviteCount}
              onChange={(e) => setInviteCount(e.target.value)}
            />
          </CCol>
          <CCol>
            <CFormRange
              className="mt-2"
              min={1}
              max={100}
              defaultValue={1}
              value={inviteCount}
              onChange={(e) => setInviteCount(e.target.value)}
            />
          </CCol>
        </CRow>
      </CippWizard.Page>
      <CippWizard.Page title="Review and Confirm" description="Confirm the settings to apply">
        <center>
          <h3 className="text-primary">Step 3</h3>
          <h5 className="card-title mb-4">Confirm and apply</h5>
        </center>
        <hr className="my-4" />
        {massResults.length < 1 && (
          <FormSpy>
            {/* eslint-disable react/prop-types */}
            {(props) => {
              return (
                <>
                  <CRow>
                    <CCol md={3}></CCol>
                    <CCol md={6}>
                      {props.values.easyMode === false && (
                        <>
                          <h5 className="mb-0">Roles and group names</h5>
                          {props.values.gdapRoles.map((role, idx) => (
                            <React.Fragment key={idx}>
                              {role.RoleName === 'Company Administrator' && (
                                <CCallout color="warning">
                                  WARNING: The Company Administrator role will prevent GDAP
                                  relationships from automatically extending. We recommend against
                                  using this in any GDAP relationship.
                                </CCallout>
                              )}
                            </React.Fragment>
                          ))}
                          <CCallout color="info">
                            <ul>
                              {props.values.gdapRoles.map((role, idx) => (
                                <li key={idx}>
                                  {role.RoleName} - {role.GroupName}
                                </li>
                              ))}
                            </ul>
                          </CCallout>
                        </>
                      )}
                      {props.values.easyMode === true && (
                        <>
                          <CCallout color="info">
                            <p>
                              You have selected CIPP to manage your roles and groups. Invites will
                              contain the following roles and groups
                            </p>
                            <ul>
                              <li>M365 GDAP Application Administrator</li>
                              <li>M365 GDAP Authentication Policy Administrator</li>
                              <li>M365 GDAP Cloud App Security Administrator</li>
                              <li>M365 GDAP Cloud Device Administrator</li>
                              <li>M365 GDAP Exchange Administrator</li>
                              <li>M365 GDAP Intune Administrator</li>
                              <li>M365 GDAP Privileged Authentication Administrator</li>
                              <li>M365 GDAP Privileged Role Administrator</li>
                              <li>M365 GDAP Security Administrator</li>
                              <li>M365 GDAP SharePoint Administrator</li>
                              <li>M365 GDAP Teams Administrator</li>
                              <li>M365 GDAP User Administrator</li>
                            </ul>
                          </CCallout>
                        </>
                      )}
                      {easyModeProgress && <CCallout color="danger">{easyModeProgress}</CCallout>}
                      {getResults.isFetching && <CSpinner />}
                    </CCol>
                  </CRow>
                </>
              )
            }}
          </FormSpy>
        )}
        {(massResults.length >= 1 || loopRunning) && (
          <>
            <CCallout color="info">
              <p className="mb-3">
                The invites have been generated. You can view the results below. The
                <strong className="m-1">invite link</strong> is to be used by a Global Administrator
                of your clients Tenant. The<strong className="m-1">onboarding</strong>link is to be
                used by a CIPP administrator to finish the process inside of CIPP.
              </p>
            </CCallout>
            <div style={{ width: '100%' }} className="mb-3">
              {loopRunning ? (
                <span>
                  Generating Invites <CSpinner className="ms-2" size="sm" />
                </span>
              ) : (
                <span>
                  Generating Invites
                  <FontAwesomeIcon className="ms-2" icon="check-circle" />
                </span>
              )}
              <CProgress className="mt-2" value={(massResults.length / inviteCount) * 100}>
                {massResults.length}/{inviteCount}
              </CProgress>
            </div>

            <CippTable
              reportName="gdap-invites"
              data={massResults}
              columns={inviteColumns}
              disablePDFExport={true}
            />
          </>
        )}
        <hr className="my-4" />
      </CippWizard.Page>
    </CippWizard>
  )
}

export default GDAPInviteWizard
