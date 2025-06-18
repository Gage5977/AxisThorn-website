tell application "System Events"
    -- Open Cloudflare if not already open
    tell application "Safari" to activate
    delay 1
    
    -- Navigate to Cloudflare DNS page
    tell application "Safari"
        make new document with properties {URL:"https://dash.cloudflare.com/95630f075913ce585a9271ef6146b2f6/dns/records"}
    end tell
    
    delay 5
    
    -- Try to click Add Record button
    tell application "System Events"
        tell process "Safari"
            try
                click button "Add record"
                delay 2
                
                -- Fill in root domain record
                set value of text field 1 to "A"
                set value of text field 2 to "@" 
                set value of text field 3 to "76.76.21.21"
                
                click button "Save"
                delay 3
                
                -- Add www record
                click button "Add record"
                delay 2
                
                set value of text field 1 to "A"
                set value of text field 2 to "www"
                set value of text field 3 to "76.76.21.21"
                
                click button "Save"
                
            on error
                display dialog "Could not automate DNS setup. Please add records manually."
            end try
        end tell
    end tell
end tell