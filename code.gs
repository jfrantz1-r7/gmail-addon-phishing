function getContextualAddOn(e) {
  try {    
    // Activate temporary Gmail add-on scopes, in this case to allow
    // message metadata and content to be read.
    GmailApp.setCurrentMessageAccessToken(e.messageMetadata.accessToken);
    var message = GmailApp.getMessageById(e.messageMetadata.messageId);
    
    var reportAction = CardService.newAction().setFunctionName("handleSendEmail").setParameters({
      notifyText: "Thank you for reporting this email!",
      rawContent: message.getRawContent(),
      body: message.getPlainBody(),
      from: message.getFrom(),
    });
               
    var textHeader = CardService.newTextParagraph()
    .setText("<b>Report a Phish</b>");
    
    var textParagraph = CardService.newTextParagraph()
    .setText("Suspicious emails or emails that meet the following common criteria should be reported below.<br><br><i>Common Criteria</i><br>1. The message conveys a sense of urgency <br>2. A call to action that includes opening an attachment. <br>3. Impersonal greeting and/or signature. <br>4. Unexpected communication without ability to verify source or legitimacy. <br>5. Links to unrecognized sites or URLs. <br><br>");
        
    var textButton = CardService.newTextButton()
    .setText("Report Now")
    .setBackgroundColor("#E85E26")
    .setOnClickAction(reportAction)
 
    var card = CardService.newCardBuilder()
    .addSection(CardService.newCardSection().addWidget(textHeader))
    .addSection(CardService.newCardSection().addWidget(textParagraph))
    .addSection(CardService.newCardSection().addWidget(textButton))
    .build();
    
    return [card];
  } catch(err) {
    console.log(err);
    return []
  }
}


function handleSendEmail(e) {
  try {
    GmailApp.sendEmail("phishing@yourdomain.com", "Phishing Reported", e.parameters.body, {
      attachments: [
          Utilities.newBlob(e.parameters.rawContent, "UTF-8", "phish_original.eml")
      ]
    });
    
    return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification()
                     .setText(e.parameters.notifyText)
                     .setType(CardService.NotificationType.INFO))
    .build();
  } catch (err) {
    console.log(err);
  }
}
