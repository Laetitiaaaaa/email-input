import { useRef, useEffect, useState } from 'react'
import providerList from 'utilities/providers.json'
import isEmail from 'validator/lib/isEmail'

const EmailInput = () => {
	const [email, setEmail] = useState('')
	const [providers, setProviders] = useState(null)
	const refEmailInput = useRef(null)

	useEffect(() => {
		//get and set compatible provider list (3 max) depending on email input
		const getCompatibleProviderList = emailInput => {
			//get the 3 most popular providers
			let compatibleProviders = providerList.slice(0, 3)
			//modify compatible provider list if email input contains '@' or if email completed
			if (emailInput.includes('@')) {
				let currentCompatibleProviders = getListFromComparisonWithProviders(
					emailInput
				)
				compatibleProviders =
					currentCompatibleProviders.length > 0
						? currentCompatibleProviders.slice(0, 3)
						: compatibleProviders
			}
			if (isEmail(emailInput)) {
				compatibleProviders = null
			}
			setProviders(compatibleProviders)
		}

		getCompatibleProviderList(email)
	}, [email])

	//get compatible provider list from comparison between domain name from email input with provider list
	const getListFromComparisonWithProviders = emailInput => {
		let compatibleProvidersList = []
		let splitEmailInput = emailInput.split('@')
        let domainName = splitEmailInput[1]
        //get slice from each provider as long as domain name from email input in order to compare both
		providerList.forEach(provider => {
			let providerSlice = provider.slice(0, domainName.length)
			let diff = domainName.localeCompare(providerSlice)
			if (diff === 0) {
				compatibleProvidersList.push(provider)
			}
		})
		return compatibleProvidersList
	}

    //construct email from email input and provider selected and save it
	const addProviderToEmail = provider => {
        //keep focus on email input when provider button clicked
        refEmailInput.current.focus()
        //construct email
		let splitEmailInput = email.split('@')
		let beforeAt = splitEmailInput[0]
		setEmail(beforeAt + '@' + provider)
	}

	return (
		<div style={{ margin: '4px' }}>
			<input
				ref={refEmailInput}
				type='email'
				placeholder='Adresse email'
				value={email}
				style={{ display: 'inline-block' }}
				autoFocus
				onChange={event => {
					setEmail(event.target.value)
				}}
			/>
			{providers && (
				<div style={{ display: 'inline-block' }}>
					{providers.map((provider, i) => (
						<button
							key={i}
							onClick={() => addProviderToEmail(provider)}
						>
							@{provider}
						</button>
					))}
				</div>
			)}
		</div>
	)
}

export default EmailInput